"use client";
import { useStory } from "@/containers/StoryPage";
import { EntityCard } from "../EntityCard";

export interface CharacterCardProps {
  characterId: string;
}

/**
 * CharacterCard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CharacterCard component.
 */
export const CharacterCard = ({ characterId }: CharacterCardProps) => {
  const { characters } = useStory();

  const character = characters.find((c) => c.id === characterId);
  console.log("character", character);
  if (!character) {
    return null;
  }

  return (
    <EntityCard
      entityType="character"
      entityId={characterId}
      initials={character.initials}
      name={character.name}
    />
  );
};
