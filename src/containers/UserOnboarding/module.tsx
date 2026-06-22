"use client";

import { OnboardingSection } from "@/components/OnboardingSection";
import { getOnboardingSessionId } from "@/lib/getOnboardingSessionId";
import { nestApiRequest } from "@/lib/nest-api";
import { Input, InputType } from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { UserOnboardingHandle } from "./handle";
import { schema } from "./schema";
import * as Style from "./style";

interface Story {
  id: string;
}

export const UserOnboarding = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        validateBeforeContinue={["handle"]}
      >
        <UserOnboardingHandle />
      </OnboardingSection>
      <OnboardingSection validateBeforeContinue={["name"]}>
        <Input
          type={InputType.TEXT}
          name="name"
          label="Pen Name"
          placeholder="Your default pen name for your stories"
          caption="You can customize the pen name per story later."
        />
      </OnboardingSection>
      <OnboardingSection>add</OnboardingSection>
    </Style.Container>
  );
};
