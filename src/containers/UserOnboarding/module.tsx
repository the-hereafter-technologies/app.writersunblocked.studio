"use client";

import { OnboardingSection } from "@/components/OnboardingSection";
import { TextInput } from "@/components/TextInput";
import { getOnboardingSessionId } from "@/lib/getOnboardingSessionId";
import { nestApiRequest } from "@/lib/nest-api";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { schema } from "./schema";
import * as Style from "./style";

interface Story {
  id: string;
}

export const UserOnboarding = () => {
  const router = useRouter();
  const [isHandleAvailable, setHandleAvailable] = useState<boolean | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!value) {
        setHandleAvailable(null);
        return;
      }

      const res = await fetch(
        `/api/users/handle-availability?handle=${encodeURIComponent(value)}`
      );
      const data = (await res.json()) as { available: boolean };
      setHandleAvailable(data.available);
    }, 400);
  }, []);

  const handleComplete = useCallback(
    async (data: { handle: string; name: string }) => {
      try {
        setSubmitError(null);
        setIsSubmitting(true);

        await nestApiRequest({
          path: "/users/me/handle",
          method: "PATCH",
          body: { handle: data.handle },
        });

        await nestApiRequest({
          path: "/users/me",
          method: "PATCH",
          body: { name: data.name },
        });

        const stories = await nestApiRequest<Story[]>({
          path: "/stories",
          method: "GET",
          cache: "no-store",
        });

        if (stories.length === 0) {
          router.push(`/onboarding/story/${getOnboardingSessionId()}`);
          return;
        }

        router.push("/");
      } catch (error) {
        if (error instanceof Error) {
          setSubmitError(error.message);
        } else {
          setSubmitError("Unable to save your account details right now.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <Style.Container
      schema={schema}
      onComplete={handleComplete}
      aria-busy={isSubmitting}
    >
      <OnboardingSection
        title="Set up your account"
        subtitle="Add the last details to start writing."
        validateBeforeContinue={["name", "handle"]}
      >
        <div className="is-available">
          <TextInput
            name="handle"
            label="Choose a handle"
            placeholder="Your unique handle (i.e., @thewritingchampion74)"
            caption="Used for your profile and community visibility."
            onChange={handleChange}
          />
          <span
            className={
              isHandleAvailable === null
                ? ""
                : isHandleAvailable
                  ? "available"
                  : "unavailable"
            }
          />
        </div>
        <TextInput
          name="name"
          label="Pen Name"
          placeholder="Your default pen name for your stories"
          caption="You can customize the pen name per story later."
        />
        {submitError ? <p>{submitError}</p> : null}
      </OnboardingSection>
    </Style.Container>
  );
};
