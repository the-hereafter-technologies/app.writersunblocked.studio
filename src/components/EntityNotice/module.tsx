import { pluralize } from "@/services/utils/plural";
import type { StoryboardScreen } from "../StoryBoard/types";
import CommentsIcon from "./comments.svg";
import LocationIcon from "./location.svg";
import * as Style from "./style";

export interface CommentsNoticeProps {
  count: number;
  entityId?: string;
  entityType?: StoryboardScreen;
}

/**
 * EntityNotice description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered EntityNotice component.
 */
export const EntityNotice = ({
  count,
  entityId,
  entityType = "story",
}: CommentsNoticeProps) => {
  let statement = `${count} ${pluralize(entityType, count)}`;
  if ((entityType === "character" || entityType === "location") && entityId) {
    statement = `${count} related ${pluralize(entityType, count)}`;
  }

  let icon = null;
  if (entityType === "character") {
    icon = <CommentsIcon />;
  } else if (entityType === "location") {
    icon = <LocationIcon />;
  }

  return (
    <Style.Container>
      {icon}
      <span>{statement}</span>
    </Style.Container>
  );
};
