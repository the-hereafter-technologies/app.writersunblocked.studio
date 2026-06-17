"use client";
import { useStoryboard } from "../StoryBoard/hooks";
import BookmarkIcon from "./bookmark.svg";
import * as Style from "./style";

export type OpenStoryboardProps = {};

/**
 * OpenStoryboard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered OpenStoryboard component.
 */
export const OpenStoryboard = () => {
  const { openBoard } = useStoryboard();
  return (
    <Style.Container>
      <button type="button" onClick={() => openBoard()}>
        <BookmarkIcon />
      </button>
    </Style.Container>
  );
};
