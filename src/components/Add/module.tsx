import type { ComponentProps } from "react";
import AddIcon from "./add.svg";
import * as Style from "./style";

export interface AddProps extends ComponentProps<typeof Style.Container> {}

/**
 * Add description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Add component.
 */
export const Add = ({ ...props }: AddProps) => {
  return (
    <Style.Container {...props}>
      <AddIcon />
    </Style.Container>
  );
};
