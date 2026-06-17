"use client";
import { AppFooter } from "@/components/AppFooter";
import { Chip } from "@/components/Chip";
import { OnboardingSection } from "@/components/OnboardingSection";
import { SelectInput } from "@/components/SelectInput";
import { TextInput } from "@/components/TextInput";
import { useRef, useState } from "react";
import { schema } from "./schema";
import * as Style from "./style";

export type SignUpProps = {};

/**
 * SignUp description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SignUp component.
 */
export const SignUp = () => {
  const handleComplete = (data: any, selectedOfferId: string | null) => {
    console.log("Form data:", data);
    console.log("Selected offer ID:", selectedOfferId);
  };
  const [isHandleAvailable, setHandleAvailable] = useState<boolean | null>(
    null
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!value) {
        setHandleAvailable(null);
        return;
      }
      const res = await fetch(
        `/api/users/handle-availability?handle=${encodeURIComponent(value)}`
      );
      const { available } = (await res.json()) as {
        handle: string;
        available: boolean;
      };
      setHandleAvailable(available);
    }, 400);
  };

  return (
    <>
      <Style.Container
        schema={schema}
        defaultValues={{ title: "Untitled" }}
        onComplete={handleComplete}
      >
        <OnboardingSection
          title="Sign Up"
          subtitle="Create your account to get started"
          validateBeforeContinue={["name", "handle"]}
        >
          <div className="is-available">
            <TextInput
              name="handle"
              label="Choose a handle"
              placeholder="Your unique handle (i.e., @thewritingchampion74)"
              caption="Primarily used in leaderboards and updates on your writing streaks!"
              onChange={handleChange}
            />
            <span className={isHandleAvailable ? "available" : "unavailable"} />
          </div>
          <TextInput
            name="name"
            label="Pen Name"
            placeholder="Your default pen name for your stories"
            caption="This will be used primarily for communication and will be your default pen name. Don't worry, you can change your pen name on each story, if you'd like."
          />
        </OnboardingSection>
        <OnboardingSection
          title="Sign Up"
          subtitle="Create your account to get started"
        >
          <SelectInput
            label="Where are you in your story?"
            name="storyStage"
            options={[
              { label: "Just starting", value: "idea" },
              { label: "Mid-draft", value: "draft" },
              { label: "Revising", value: "revising" },
              { label: "Completely stuck", value: "stuck" },
            ]}
            render={(item, isActive) => <Chip {...item} active={isActive} />}
          />
          <SelectInput
            label="What are you working on?"
            name="projectType"
            options={[
              { label: "A Novel", value: "novel" },
              { label: "Short story collection", value: "short_story" },
              { label: "Screenplay", value: "screenplay" },
              { label: "Series", value: "series" },
              { label: "Not sure yet", value: "not_sure" },
            ]}
            render={(item, isActive) => <Chip {...item} active={isActive} />}
          />
          <SelectInput
            label="How did you hear about us?"
            name="referralSource"
            options={[
              { label: "Instagram", value: "instagram" },
              { label: "Facebook", value: "facebook" },
              { label: "Twitter/X", value: "twitter" },
              { label: "Reddit", value: "reddit" },
              { label: "Friend or fellow writer", value: "friend" },
              { label: "Other", value: "other" },
            ]}
            render={(item, isActive) => <Chip {...item} active={isActive} />}
          />
        </OnboardingSection>
      </Style.Container>
      <AppFooter />
    </>
  );
};
