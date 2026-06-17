"use client";
import { useState } from "react";
import * as Style from "./style";
import { DiscoveryItemType } from "./types";

const MAX_PREVIEW_LENGTH = 100;

export interface DiscoveryItemProps extends DiscoveryItemType {}

/**
 * DiscoveryItem description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered DiscoveryItem component.
 */
export const DiscoveryItem = ({ type, title, text }: DiscoveryItemProps) => {
  const [showMore, setShowMore] = useState(false);

  const content = showMore
    ? text
    : text.slice(0, MAX_PREVIEW_LENGTH) +
      (text.length > MAX_PREVIEW_LENGTH ? "..." : "");

  return (
    <Style.Container>
      <span>{type}</span>
      <h6>{title}</h6>
      <p>{content}</p>
      <button onClick={() => setShowMore(!showMore)} type="button">
        {showMore ? "Show Less" : "Show More"}
      </button>
    </Style.Container>
  );
};
