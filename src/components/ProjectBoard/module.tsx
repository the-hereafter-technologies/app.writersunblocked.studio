"use client";
import { useStory } from "@/containers/StoryPage";
import { deleteStory } from "@/services/api/deleteStory";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import {
  BookPreview,
  DangerZoneInput,
  type DeleteStoryData,
  PointOfViewInput,
  TenseInput,
} from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Style from "./style";

/**
 * ProjectBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered ProjectBoard component.
 */
export const ProjectBoard = () => {
  const { story } = useStory();
  const { user } = useCurrentUser();
  const form = useForm();
  const router = useRouter();

  const handleDeleteStory = useCallback(
    async (data: DeleteStoryData) => {
      try {
        await deleteStory(data.storyId);
        router.push("/");
      } catch {
        console.error("error deleting story");
      }
    },
    [router]
  );

  const isReady = useMemo(() => {
    if (!story || !user) return false;
    return true;
  }, [story, user]);

  if (!isReady) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <Style.Container>
        <BookPreview
          defaultValue={{
            title: story?.title,
            penName: story?.penName ?? user?.name ?? undefined,
          }}
        />
        <Style.BookContentContainer>
          <Style.BookContentGuard>
            <h5>Default Scene Settings</h5>
            <Style.SceneSettings>
              <TenseInput name="tense" />
              <PointOfViewInput name="point-of-ciew" />
            </Style.SceneSettings>
            {story && (
              <DangerZoneInput
                // @ts-expect-error - fixed in @writersunblocked/ui@0.4.0
                story={story}
                onSubmit={handleDeleteStory}
              />
            )}
          </Style.BookContentGuard>
        </Style.BookContentContainer>
      </Style.Container>
    </FormProvider>
  );
};
