"use client";

import { SpellcheckGuard } from "@/components/SpellcheckGuard/module";
import { Main, Theme } from "@/theme"
import { Modal } from "@writersunblocked/ui"
import type { PropsWithChildren } from "react"

/**
 * Root description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Root component.
 */
export const Root = ({ children }: PropsWithChildren) => {
  return (
    <Theme theme={Main}>
      <SpellcheckGuard />
      <Modal>
        {children}
      </Modal>
    </Theme>
  );
};
