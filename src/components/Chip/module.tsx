import { useState } from "react";
import * as Style from "./style";

export interface ChipProps {
	label: string;
	value: string;
	active?: boolean;
	onClick?: (value: string) => void;
}

/**
 * Chip description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Chip component.
 */
export const Chip = ({ label, active = false }: ChipProps) => {
	return <Style.Container $active={active}>{label}</Style.Container>;
};
