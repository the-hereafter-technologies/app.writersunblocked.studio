"use client";
import { logout } from "@/components/LogoutButton/server";
import { useStoryboard } from "@/components/StoryBoard/hooks";
import { StoryBoardProvider } from "@/components/StoryBoard/provider";
import { StoryPlanner } from "@/components/StoryPlanner";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { StoryboardScreen } from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ObserverProvider } from "./observer";
import { StoryProvider, useStory } from "./provider";
import { StoryContent } from "./story";
import * as Style from "./style";

export interface StoryPageProps {
  storyId: string;
}

const StoryAppLayout = () => {
  const {
    story,
    editorScenes,
    sceneOrganizerValue,
    createSceneForOrganizer,
    handleSceneOrganizerChange,
    updateSceneLabel,
  } = useStory();
  const { openBoard } = useStoryboard();
  const router = useRouter();
  const { user, stories } = useCurrentUser();

  const handleClickMenu = useCallback(
    async (entity: string, storyId?: string) => {
      if (entity === "edit-story") {
        router.push(`/story/${storyId}`);
      } else if (entity === "return-to-dashboard") {
        router.push("/");
      } else if (entity === "story-settings") {
        router.push(`/story/${storyId}/settings`);
      } else if (entity === "manage-account") {
        router.push("/account");
      } else if (entity === "billing-plan") {
        router.push("/billing");
      } else if (entity === "whats-new") {
        // router.push("/whats-new");
      } else if (entity === "sign-out") {
        await logout();
        router.push("/");
      }
    },
    [router]
  );

  if (!user) {
    return null;
  }

  return (
    <Style.Container>
      <Style.MainSideBar
        onBookmarkClick={() => openBoard()}
        user={user}
        stories={stories}
        currentStory={story}
        onLinkClick={(sceneId: string) =>
          router.push(`/story/${story?.id}#scene-${sceneId}`)
        }
        onAddScene={createSceneForOrganizer}
        onChange={handleSceneOrganizerChange}
        onSceneTitleChange={updateSceneLabel}
        onClickMenu={handleClickMenu}
        scenes={editorScenes}
        value={sceneOrganizerValue}
        title={story?.title}
      />
      <Style.SceneContainer>
        <StoryContent />
      </Style.SceneContainer>
    </Style.Container>
  );
};

const StoryPageBody = () => {
  const { story, refreshAll, isLoading } = useStory();
  const { openBoard } = useStoryboard();

  const handleOnboardingComplete = useCallback(async () => {
    await refreshAll();
    openBoard(StoryboardScreen.Scene);
  }, [openBoard, refreshAll]);

  if (isLoading) {
    return null;
  }

  if (story && !story.onboardingComplete) {
    return (
      <StoryPlanner storyId={story.id} onCompleted={handleOnboardingComplete}>
        <StoryAppLayout />
      </StoryPlanner>
    );
  }

  return <StoryAppLayout />;
};

/**
 * StoryPage description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered StoryPage component.
 */
export const StoryPage = ({ storyId }: StoryPageProps) => {
  return (
    <StoryProvider storyId={storyId}>
      <ObserverProvider>
        <StoryBoardProvider>
          <StoryPageBody />
        </StoryBoardProvider>
      </ObserverProvider>
    </StoryProvider>
  );
};
