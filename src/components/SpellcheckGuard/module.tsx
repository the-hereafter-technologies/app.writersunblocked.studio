"use client";

import {
  applySpellcheckGuardToTree,
} from "@/lib/spellcheck-guard";
import { useEffect } from "react";

export function SpellcheckGuard() {
  useEffect(() => {
    applySpellcheckGuardToTree(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            applySpellcheckGuardToTree(node);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
