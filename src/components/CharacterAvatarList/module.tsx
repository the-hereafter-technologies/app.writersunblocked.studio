import type { StoryCharacter } from "@/services/api/story";
import * as Style from "./style";

export interface CharacterAvatarListProps {
  characters: Partial<StoryCharacter>[];
}

/**
 * CharacterAvatarList description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CharacterAvatarList component.
 */
export const CharacterAvatarList = ({
  characters,
}: CharacterAvatarListProps) => {
  return (
    <Style.Container>
      {characters.map((character) => (
        <Style.Avatar
          key={character.id}
          initials={character.initials ?? ""}
          color={character.color}
        />
      ))}
    </Style.Container>
  );
};
