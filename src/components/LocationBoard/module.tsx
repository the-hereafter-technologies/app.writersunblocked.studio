"use client";
import { useStory } from "@/containers/StoryPage/provider";
import { LocationCard } from "../LocationCard";
import * as Style from "./style";

export interface LocationBoardProps {
  locationId?: string | null;
}

/**
 * LocationBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered LocationBoard component.
 */
export const LocationBoard = ({ locationId }: LocationBoardProps) => {
  const { locations } = useStory();

  return (
    <Style.Container>
      {locations.map((location) => (
        <LocationCard key={location.id} locationId={location.id} />
      ))}
    </Style.Container>
  );
};
