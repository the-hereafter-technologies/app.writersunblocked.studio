"use client";
import { useStory } from "@/containers/StoryPage";
import { CharacterCard } from "../CharacterCard";
import * as Style from "./style";

export interface CharacterBoardProps {
  characterId?: string | null;
}

/**
 * CharacterBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CharacterBoard component.
 */
export const CharacterBoard = ({ characterId }: CharacterBoardProps) => {
  const { characters } = useStory();
  return (
    <Style.Container>
      {characters.map((character) => (
        <CharacterCard key={character.id} characterId={character.id} />
      ))}
    </Style.Container>
  );
};
