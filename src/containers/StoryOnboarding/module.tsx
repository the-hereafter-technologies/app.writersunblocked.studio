"use client";
import { OnboardingSection } from "@/components/OnboardingSection";
import { ChipSelectInput, Input, InputType } from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
// import { TextInput } from "@/components/TextInput";
import { createProject } from "@/services/api/createProject";
import { useCheckout } from "@/services/hooks/useCheckout";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { audienceType, genreType, storyModeType } from "./data";
import { NewStory } from "./new-story";
import { type StoryOnboardingFormValues, schema } from "./schema";
import * as Style from "./style";

export interface StoryOnboardingProps {
  onboardingId: string;
}

/**
 * StoryOnboarding description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered StoryOnboarding component.
 */
export const StoryOnboarding = ({
  onboardingId: _onboardingId,
}: StoryOnboardingProps) => {
  const router = useRouter();
  const { createCheckoutSession } = useCheckout();
  const { user } = useCurrentUser();

  const handleComplete = useCallback(
    async (data: StoryOnboardingFormValues, selectedOfferId: string | null) => {
      const project = await createProject({
        title: data.title,
        mode: data.mode,
        genre: data.genre,
        audience: data.audience,
        isSeries: data.projectType === "series",
        penName: data.penName,
      });

      if (selectedOfferId) {
        const origin = window.location.origin;
        await createCheckoutSession(
          selectedOfferId,
          `${origin}/story/${project.id}?upgraded=true`,
          `${origin}/story/${project.id}`
        );
      } else {
        router.push(`/story/${project.id}`);
      }
    },
    [createCheckoutSession, router]
  );

  if (!user?.id) return null;

  return (
    <Style.Container
      schema={schema}
      defaultValues={{
        title: "Untitled",
        userId: user.id,
        mode: "novel",
        penName: user.name,
      }}
      onComplete={handleComplete}
    >
      <OnboardingSection
        title="Start a new project"
        subtitle="This time you'll finish."
        validateBeforeContinue={["title"]}
      >
        <Input
          type={InputType.TEXT}
          label="What is the title of your story?"
          caption="'Untitled' will be used if you don't provide a title."
          name="title"
        />
      </OnboardingSection>
      <OnboardingSection
        title="Tell us about your story"
        subtitle="It's okay if you don't have it all figured out yet."
      >
        <ChipSelectInput
          name="genre"
          label="Do you know the genre of your story?"
          options={genreType}
        />
        <ChipSelectInput
          label="Are you writing for a specific audience?"
          options={audienceType}
          name="audience"
        />
      </OnboardingSection>
      <OnboardingSection
        title="Finalize the details"
        subtitle="It's okay if you don't have it all figured out yet."
      >
        <Input
          type={InputType.RADIO}
          label="What writing mode are you starting in?"
          options={storyModeType}
          name="mode"
        />
        <Input
          type={InputType.TEXT}
          label="Pen name"
          name="penName"
          caption="If you're writing this story under a pen name, you can add it here."
        />
      </OnboardingSection>
      <OnboardingSection>
        <NewStory />
      </OnboardingSection>
    </Style.Container>
  );
};
