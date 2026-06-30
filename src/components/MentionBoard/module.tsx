import { useStory } from "@/containers/StoryPage";
import { MentionOrganizer } from "@writersunblocked/ui/app";
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
export const MentionBoard = ({ mentionId: _mentionId }: MentionBoardProps) => {
  const {
    mentions,
    mentionOrganizerValue,
    handleMentionOrganizerChange,
    createMentionForOrganizer,
    createGroupForOrganizer,
    removeGroupFromOrganizer,
  } = useStory();

  // if (mentions.length === 0) {
  //   return (
  //     <Style.Container>
  //       <Style.EmptyState>
  //         No mentions yet. Add a mention or highlight text in your story to create
  //         one.
  //       </Style.EmptyState>
  //     </Style.Container>
  //   );
  // }

  return (
    <Style.Container>
      <MentionOrganizer
        mentions={mentions}
        value={mentionOrganizerValue}
        onChange={handleMentionOrganizerChange}
        onAddMention={createMentionForOrganizer}
        onCreateGroup={createGroupForOrganizer}
        onRemoveGroup={removeGroupFromOrganizer}
      />
    </Style.Container>
  );
};
