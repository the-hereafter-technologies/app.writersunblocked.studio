import { useStoryboard } from "@/components/StoryBoard/hooks";
import { MentionCard } from "@writersunblocked/ui";
import { useStory } from "./provider";

export interface MentionItemProps {
  mentionId: string;
}

export const MentionItem = ({ mentionId }: MentionItemProps) => {
  const { mentions } = useStory();
  const { openBoard } = useStoryboard();
  const mention = mentions?.find((m) => m.id === mentionId);
  if (!mention) {
    return null;
  }

  return (
    <MentionCard
      name={mention.name}
      mentionType={mention.type}
      color={mention.color}
      onClick={() => openBoard("mention", mention.id)}
    />
  );
};
