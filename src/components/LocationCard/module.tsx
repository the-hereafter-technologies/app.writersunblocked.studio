"use client";
import { useStory } from "@/containers/StoryPage/provider";
import { EntityCard } from "../EntityCard";
import { useStoryboard } from "../StoryBoard/hooks";

export interface LocationCardProps {
  locationId: string;
}

/**
 * LocationCard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered LocationCard component.
 */
export const LocationCard = ({ locationId }: LocationCardProps) => {
  const { locations } = useStory();
  const { openBoard } = useStoryboard();

  const location = locations.find((l) => l.id === locationId);
  console.log("location", location);
  if (!location) {
    return null;
  }

  return (
    <EntityCard
      entityType="location"
      entityId={locationId}
      initials={location.name[0]}
      name={location.name}
    />
  );
};
