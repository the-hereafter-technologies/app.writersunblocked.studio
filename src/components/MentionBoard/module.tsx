import { useStory } from "@/containers/StoryPage";
import { MentionOrganizer, MentionPanel } from "@writersunblocked/ui";
import * as Style from "./style";

export type MentionBoardProps = {
  mentionId?: string | null;
};

/**
 * MentionBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered MentionBoard component.
 */
export const MentionBoard = ({ mentionId }: MentionBoardProps) => {
  const { mentions } = useStory();

  const mention = mentions.find((m) => m.id === mentionId) ?? mentions[0];

  return (
    <Style.Container>
      <Style.StoryMentions>
        <Style.MentionList>
          <MentionOrganizer mentions={mentions} />
        </Style.MentionList>
        {/* {mentions.length > 0 ? (
          
        ) : (
          <Style.EmptyState>
            No mentions yet. Highlight text in your story to create a mention.
          </Style.EmptyState>
        )} */}
      </Style.StoryMentions>
      <Style.StoryMention>
        {mention && <MentionPanel mention={mention} />}
      </Style.StoryMention>
    </Style.Container>
  );
};
