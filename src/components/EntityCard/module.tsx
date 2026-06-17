"use client";
import { CharacterAvatar } from "../CharacterAvatar";
import { CommentsNotice } from "../CommentsNotice";
import { ItemMenuButton } from "../ItemMenuButton";
import { NotesNotice } from "../NotesNotice";
import { useStoryboard } from "../StoryBoard/hooks";
import type { StoryboardScreen } from "../StoryBoard/types";
import CharacterIcon from "./character.svg";
import LocationIcon from "./location.svg";
import * as Style from "./style";

export interface EntityCardProps {
  entityType: StoryboardScreen;
  entityId: string;
  initials: string;
  name: string;
}

/**
 * EntityCard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered EntityCard component.
 */
export const EntityCard = ({
  entityType,
  entityId,
  initials,
  name,
}: EntityCardProps) => {
  const { openBoard } = useStoryboard();

  return (
    <Style.Container>
      <Style.Card>
        <Style.Header>
          <Style.EntityHeader onClick={() => openBoard(entityType, entityId)}>
            <div>
              {entityType === "character" ? (
                <CharacterIcon />
              ) : (
                <LocationIcon />
              )}
            </div>
            <div>
              <CharacterAvatar initials={initials} />
            </div>
            <div>{name}</div>
          </Style.EntityHeader>
          <ItemMenuButton data={[]} render={() => <div />} />
        </Style.Header>
        {/* <Style.EntityBody>some text</Style.EntityBody> */}
        <Style.Footer>
          <div>
            <NotesNotice
              entityId={entityId}
              entityType={entityType}
              count={0}
            />
            <CommentsNotice
              count={0}
              entityId={entityId}
              entityType={entityType}
            />
          </div>
          <div></div>
        </Style.Footer>
      </Style.Card>
    </Style.Container>
  );
};
