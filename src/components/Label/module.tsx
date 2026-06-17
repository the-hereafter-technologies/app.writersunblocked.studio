import * as Style from "./style";

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label description
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The content to be rendered inside the label.
 * @returns {JSX.Element} The rendered Label component.
 */
export const Label = ({ children, ...props }: LabelProps) => {
	return <Style.Container {...props}>{children}</Style.Container>;
};
