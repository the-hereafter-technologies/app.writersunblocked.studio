"use client";
import { DiscoveryItem } from "../DiscoveryItem";
import { useDiscovery } from "../DiscoveryProvider";
import * as Style from "./style";

/**
 * DiscoveryList description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered DiscoveryList component.
 */
export const DiscoveryList = () => {
  const { directions, loading } = useDiscovery();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Style.Container>
      {directions.map((direction) => (
        <DiscoveryItem key={direction.id} {...direction} />
      ))}
    </Style.Container>
  );
};
