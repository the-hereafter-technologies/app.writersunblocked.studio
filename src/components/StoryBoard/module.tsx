import * as Style from "./style";

export interface StoryBoardProps {
  storyId?: string | null;
}

/**
 * StoryBoard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered StoryBoard component.
 */
export const StoryBoard = ({ storyId }: StoryBoardProps) => {
  return (
    <Style.Container>
      <h1>StoryBoard</h1>
      <p>{storyId ?? "No story selected"}</p>
    </Style.Container>
  );
};
