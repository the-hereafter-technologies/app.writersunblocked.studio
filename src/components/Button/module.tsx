"use client";
import { Button as AppButton } from "@writersunblocked/ui/app";
import { useRouter } from "next/navigation";
import { type ComponentProps, useCallback } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  label?: string;
  arrow?: boolean;
  href?: string;
  loading?: boolean;
  variant?: string;
}

/**
 * Button description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Button component.
 */
export const Button = ({
  label,
  arrow,
  href,
  onClick,
  ...props
}: ButtonProps) => {
  const router = useRouter();
  const handleClick = useCallback(
    (testId?: string) => {
      onClick?.(testId);
      if (href) {
        router.push(href);
      }
    },
    [href, onClick, router]
  );
  return (
    <AppButton label={label} arrow={arrow} onClick={handleClick} {...props} />
  );
};
