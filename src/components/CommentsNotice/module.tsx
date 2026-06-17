import type { StoryboardScreen } from "../StoryBoard/types";
import CommentsIcon from "./comments.svg";
import * as Style from "./style";

export interface CommentsNoticeProps {
  count: number;
  entityId?: string;
  entityType?: StoryboardScreen;
}

/**
 * CommentsNotice description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CommentsNotice component.
 */
export const CommentsNotice = ({
  count,
  entityId,
  entityType = "story",
}: CommentsNoticeProps) => {
  let statement = `${count} comment${count > 1 ? "s" : ""}`;
  if ((entityType === "character" || entityType === "location") && entityId) {
    statement = `${count} related comment${count > 1 ? "s" : ""}`;
  }

  return (
    <Style.Container>
      <CommentsIcon />
      <span>{statement}</span>
    </Style.Container>
  );
};
