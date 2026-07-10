"use client";

import { SpellcheckGuard } from "@/components/SpellcheckGuard/module";
import { Main, Theme } from "@/theme";
import { Modal } from "@writersunblocked/ui";
import { WritingAssistantGuard } from "@writersunblocked/ui/app";
import type { PropsWithChildren } from "react";

/**
 * Root description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered Root component.
 */
export const Root = ({ children }: PropsWithChildren) => {
  return (
    <Theme theme={Main}>
      <WritingAssistantGuard>
        <SpellcheckGuard />
        <Modal>{children}</Modal>
      </WritingAssistantGuard>
    </Theme>
  );
};
