import type { HighlightBackgroundColors } from "@/services/hooks/useHighlightColors";
import * as Style from "./style";

export interface CharacterAvatarProps {
  initials: string;
  color?: keyof HighlightBackgroundColors;
}

/**
 * CharacterAvatar description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered CharacterAvatar component.
 */
export const CharacterAvatar = ({
  initials,
  color = "amber",
}: CharacterAvatarProps) => {
  return (
    <Style.Container
      $color={color}
      className={["character", color ? `character--${color}` : ""].join(" ")}
    >
      {initials}
    </Style.Container>
  );
};
