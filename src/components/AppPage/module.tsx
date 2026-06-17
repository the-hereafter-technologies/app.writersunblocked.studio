import { ComponentProps } from "react"
import * as Style from "./style";

export interface AppPageProps extends ComponentProps<typeof Style.Container> {}


/**
 * AppPage description
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The children to render inside the AppPage container.
 * @returns {JSX.Element} The rendered AppPage component.
 */
export const AppPage = ({ children, ...props }: AppPageProps) => {
  return (
    <Style.Container {...props}>
      {children}
    </Style.Container>
  );
};
