import { createProject } from "@/services/api/createProject";
import { useCheckout } from "@/services/hooks/useCheckout";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { NewStoryCell } from "@writersunblocked/ui";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { StoryOnboardingFormValues } from "./schema";

export const NewStory = () => {
  const { watch, handleSubmit } = useFormContext<StoryOnboardingFormValues>();
  const title = watch("title");
  const penName = watch("penName");
  const { user } = useCurrentUser();
  const router = useRouter();
  const { createCheckoutSession } = useCheckout();

  console.log(user?.subscription);

  const onComplete = useCallback(
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

  const handleContinueFree = useCallback(() => {
    handleSubmit((data) => onComplete?.(data, null))();
  }, [handleSubmit, onComplete]);

  if (!user?.subscription) return null;

  return (
    <NewStoryCell
      title={title as string}
      penName={penName as string}
      trialing={user?.subscription?.subscriptionStatus === "trialing"}
      trialExpires={user?.subscription?.trialEndsAt as string}
      onClickUpgrade={() => console.log("hit")}
      currentTier={user?.subscription?.tier}
      onProjectStart={handleContinueFree}
    />
  );
};
