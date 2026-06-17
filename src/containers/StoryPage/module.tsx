"use client";
import { useStoryboard } from "@/components/StoryBoard/hooks";
import { StoryBoardProvider } from "@/components/StoryBoard/provider";
import { StoryPlanner } from "@/components/StoryPlanner";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { StoryboardScreen } from "@writersunblocked/ui";
import { useRouter } from "next/navigation";
import { ObserverProvider } from "./observer";
import { StoryProvider, useStory } from "./provider";
import { StoryContent } from "./story";
import * as Style from "./style";

export interface StoryPageProps {
  storyId: string;
}

const StoryPageBody = () => {
  const {
    story,
    refreshAll,
    editorScenes,
    sceneOrganizerValue,
    createSceneForOrganizer,
    handleSceneOrganizerChange,
    updateSceneLabel,
    isLoading,
  } = useStory();
  const { openBoard } = useStoryboard();
  const router = useRouter();
  const { user, stories } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (story && !story.onboardingComplete) {
    return (
      <StoryPlanner
        storyId={story.id}
        onCompleted={async () => {
          await refreshAll();
          openBoard(StoryboardScreen.Scene);
        }}
      />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Style.Container>
      <Style.MainSideBar
        onBookmarkClick={() => openBoard()}
        user={user}
        stories={stories?.map((s) => ({ id: s.id, title: s.title })) || []}
        onLinkClick={(sceneId: string) =>
          router.push(`/story/${story?.id}#scene-${sceneId}`)
        }
        onAddScene={createSceneForOrganizer}
        onChange={handleSceneOrganizerChange}
        onSceneTitleChange={updateSceneLabel}
        scenes={editorScenes}
        value={sceneOrganizerValue}
        title={story?.title}
        links={[
          {
            label: "Back to Dashboard",
            onClick: () => router.push("/"),
          },
        ]}
      />
      <Style.SceneContainer>
        <StoryContent />
      </Style.SceneContainer>
      {/* <Style.StoryBoardColumn>
        <BoardPanel />
      </Style.StoryBoardColumn> */}
    </Style.Container>
  );
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
