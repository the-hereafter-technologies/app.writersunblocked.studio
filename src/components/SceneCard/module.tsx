"use client";
import { useStory } from "@/containers/StoryPage/provider";
import { SceneCard as UISceneCard } from "@writersunblocked/ui";
import { useStoryboard } from "../StoryBoard/hooks";
import * as Style from "./style";

export interface SceneCardProps {
  sceneId: string;
}

/**
 * SceneCard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SceneCard component.
 */
export const SceneCard = ({ sceneId }: SceneCardProps) => {
  const { scenes } = useStory();
  const { openBoard } = useStoryboard();
  const scene = scenes.find((p) => p.id === sceneId);
  const chapters = scene?.identifyingChapters;
  const threadCount = scene?.threadCount;
  const wordCount = scene?.wordCount;
  const notesCount = scene?.notes?.length ?? 0;
  const commentsCount = scene?.comments?.length ?? 0;
  const mentions = scene?.mentions ?? [];

  console.log(scene);

  if (!scene) {
    return null;
  }

  console.log("Rendering SceneCard for scene:", mentions);

  return (
    <Style.Container onClick={() => openBoard("scene", scene.id)}>
      <UISceneCard
        noteText={scene.title}
        color={scene.color ?? "amber"}
        mentions={mentions}
        chapters={[]}
        threadCount={threadCount}
        wordCount={wordCount}
        notesCount={notesCount}
        commentsCount={commentsCount}
        versionsCount={undefined}
      />
    </Style.Container>
  );
};
