import { ComponentProps } from "react";
import * as Style from "./style";

export interface ButtonProps extends ComponentProps<"button"> {
  label?: string;
  arrow?: boolean;
  href?: string;
  loading?: boolean;
  variant?: string;
}

/**
 * Button description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Button component.
 */
export const Button = ({ label, arrow, href, ...props }: ButtonProps) => {
  const Container = href
    ? ({ ...props }) => <Style.LinkContainer href={href} {...props} />
    : Style.Container;

  return (
    <Container {...props}>
      {label}
      {arrow && <span>→</span>}
    </Container>
  );
};
