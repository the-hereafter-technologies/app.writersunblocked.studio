import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Styled from "./style";

export const DEFAULT_MAX_CHARACTERS = 200;
const NON_CHARACTER_KEYS = new Set([
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "Tab",
  "Enter",
]);

export interface TextFieldProps
  extends Omit<ComponentProps<typeof Styled.TextField>, "onChange"> {
  onChange?: (text: string) => void;
  maxCharacters?: number;
  placeholder?: string;
  defaultValue?: string;
}

export const TextField = ({
  onChange,
  maxCharacters = DEFAULT_MAX_CHARACTERS,
  defaultValue = undefined,
  placeholder,
  ...props
}: TextFieldProps) => {
  const [text, setText] = useState(defaultValue);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTypedRef = useRef(false);

  const handleChange = useCallback(
    (e: React.InputEvent<HTMLDivElement>) => {
      let textInput = e.currentTarget.textContent;
      textInput = textInput?.trim().slice(0, maxCharacters) || "";
      setText(textInput);
      hasTypedRef.current = true;
    },
    [maxCharacters]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.metaKey || e.ctrlKey || e.altKey || NON_CHARACTER_KEYS.has(e.key)) {
        return;
      }

      const currentText = e.currentTarget.textContent?.trim() || "";
      if (currentText.length >= maxCharacters) {
        e.preventDefault();
      }
    },
    [maxCharacters]
  );

  const isEmpty = useMemo(() => {
    if (typeof text !== "string") {
      return false;
    }
    const normalizedText = text?.trim() || "";
    const normalizedDefault = defaultValue?.trim() || "";
    if (normalizedDefault && normalizedText === normalizedDefault) {
      return true;
    }
    return normalizedText.length === 0;
  }, [text, defaultValue]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      text && onChange?.(text);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [text, onChange]);

  return (
    <Styled.TextField
      {...props}
      onInput={handleChange}
      onKeyDown={handleKeyDown}
      $empty={isEmpty && !hasTypedRef.current}
      data-placeholder={defaultValue ?? placeholder}
    />
  );
};
