import { useState } from "react";
import * as Styled from "./style";

export type SelectOption<T> = { value: string; label?: string } & T;

export interface SelectFieldProps<T> {
	render: (item: SelectOption<T>, isActive: boolean) => React.ReactNode;
	options: SelectOption<T>[];
	onSelected?: (option: SelectOption<T>) => void;
	defaultValue?: SelectOption<T>["value"];
}

export const SelectField = <T,>({
	render,
	options,
	onSelected,
	defaultValue,
	...props
}: SelectFieldProps<T>) => {
	const [selected, setSelected] = useState<SelectOption<T> | null>(
		options.find((option) => option.value === defaultValue) ?? null,
	);

	return (
		<Styled.FieldContainer {...props}>
			{options.map((option, index) => {
				const isActive = selected?.value === option.value;
				return (
					<div
						key={option.value}
						onClick={() => {
							setSelected(option);
							onSelected?.(option);
						}}
					>
						{render?.(option, isActive)}
					</div>
				);
			})}
		</Styled.FieldContainer>
	);
};
