import type { StoryCharacter } from "@/services/api/story";
import * as Styled from "./style";

export interface SceneCellCharactersProps {
  characters: StoryCharacter[];
}

export const SceneCellCharacters = ({
  characters,
}: SceneCellCharactersProps) => {
  console.log(characters);
  return (
    <div>
      <Styled.SectionLabel>Characters in the moment</Styled.SectionLabel>
      {characters?.map((character) => (
        <div key={character.id}>{character.name}</div>
      ))}
    </div>
  );
};
