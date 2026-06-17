import * as Style from "./style";

export interface AppFooterProps {}


/**
 * AppFooter description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered AppFooter component.
 */
export const AppFooter = ({}: AppFooterProps) => {
  return (
    <Style.Container>
      <div>Copyright &copy; {new Date().getFullYear()} The Hereafter Technologies.</div>
      <div>Privacy | Terms | Cookies</div>
    </Style.Container>
  );
};
