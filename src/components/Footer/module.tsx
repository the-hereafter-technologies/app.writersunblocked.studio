import * as Style from "./style";

export interface FooterProps {}


/**
 * Footer description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Footer component.
 */
export const Footer = ({}: FooterProps) => {
  return (
    <Style.Container>
      <h1>Footer</h1>
    </Style.Container>
  );
};
