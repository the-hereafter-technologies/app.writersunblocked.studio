import * as Style from "./style";

export interface StoryCardProps {}


/**
 * StoryCard description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered StoryCard component.
 */
export const StoryCard = ({}: StoryCardProps) => {
  return (
    <Style.Container>
      <h1>StoryCard</h1>
    </Style.Container>
  );
};
