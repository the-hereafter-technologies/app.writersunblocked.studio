"use client";
import { useCallback, useId } from "react";
import { useFormContext } from "react-hook-form";
import { TextField } from "./field";
import * as Style from "./style";

export interface TextInputProps {
  label: string;
  caption?: string;
  name: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

/**
 * TextInput description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export const TextInput = ({
  label,
  caption,
  name,
  placeholder,
  onChange,
}: TextInputProps) => {
  const id = useId();
  const { setValue, getValues, clearErrors } = useFormContext();

  const defaultValue = getValues(name);

  const handleChange = useCallback(
    (text: string) => {
      setValue(name, text);
      if (onChange) {
        onChange(text);
      }
      clearErrors();
    },
    [name, setValue, onChange, clearErrors]
  );

  return (
    <Style.Container>
      <Style.TextLabel htmlFor={id}>{label}</Style.TextLabel>
      <TextField
        onChange={handleChange}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
      {caption && <Style.TextCaption>{caption}</Style.TextCaption>}
    </Style.Container>
  );
};
