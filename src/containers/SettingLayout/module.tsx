import * as Style from "./style";

export interface SettingLayoutProps {
  children: React.ReactNode;
}

/**
 * SettingLayout description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered SettingLayout component.
 */
export const SettingLayout = ({ children }: SettingLayoutProps) => {
  return <Style.Container>{children}</Style.Container>;
};
