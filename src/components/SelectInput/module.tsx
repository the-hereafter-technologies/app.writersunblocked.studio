import { useCallback } from "react";
import { SelectField, SelectFieldProps, SelectOption } from "./field";
import * as Style from "./style";
import { Label } from "../Label";
import { useFormContext } from "react-hook-form";

export interface SelectInputProps<T> extends SelectFieldProps<T> {
	label?: string;
	name: string;
}

/**
 * SelectInput description
 *
 * @param {Object} props - The properties object.
 * @param {Array} options - The array of options to display in the select input.
 * @param {Function} render - The render function to render each option.
 * @returns {JSX.Element} The rendered SelectInput component.
 */
export const SelectInput = <T,>({
	options,
	render,
	label,
	name,
	...props
}: SelectInputProps<T>) => {
	const { setValue, getValues } = useFormContext();

	const defaultValue = getValues(name);

	const handleSelected = useCallback(
		(option: SelectOption<T>) => {
			if (!option || !option.value) return;
			setValue(name, option.value);
		},
		[name, setValue],
	);

	return (
		<Style.Container {...props}>
			<Label>{label}</Label>
			<SelectField
				options={options}
				render={render}
				onSelected={handleSelected}
				defaultValue={defaultValue}
			/>
		</Style.Container>
	);
};
