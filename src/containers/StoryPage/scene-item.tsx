import { useStoryboard } from "@/components/StoryBoard/hooks";
import { SceneCard } from "@writersunblocked/ui";
import { useStory } from "./provider";

export interface SceneItemProps {
  sceneId: string;
}

export const SceneItem = ({ sceneId }: SceneItemProps) => {
  const { scenes } = useStory();
  const { openBoard } = useStoryboard();
  const scene = scenes?.find((s) => s.id === sceneId);
  if (!scene) {
    return null;
  }

  return (
    <SceneCard
      noteText={scene.title}
      color={scene.color ?? "amber"}
      chapters={[]}
      wordCount={scene.wordCount}
      threadCount={scene.threadCount}
      onClick={() => openBoard()}
    />
  );
};
