import { pluralize } from "@/services/utils/plural";
import type { StoryboardScreen } from "../StoryBoard/types";
import NotesIcon from "./notes.svg";
import * as Style from "./style";

export interface NotesNoticeProps {
  entityId?: string;
  entityType?: StoryboardScreen;
  count: number;
}

/**
 * NotesNotice description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered NotesNotice component.
 */
export const NotesNotice = ({
  entityId,
  entityType = "story",
  count,
}: NotesNoticeProps) => {
  let statement = `${count} ${pluralize("note", count)}`;
  if ((entityType === "character" || entityType === "location") && entityId) {
    statement = `${count} related ${pluralize("note", count)}`;
  }

  return (
    <Style.Container>
      <NotesIcon />
      <span>{statement}</span>
    </Style.Container>
  );
};
