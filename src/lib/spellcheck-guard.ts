export const SPELLCHECK_GUARD_SELECTOR =
  'input, textarea, [contenteditable=""], [contenteditable="true"]';

export const EDITOR_BLOCK_SELECTOR =
  '[contenteditable="true"] p, [contenteditable=""] p, [contenteditable="true"] [data-type], [contenteditable=""] [data-type]';

export const spellcheckGuardAttrs = {
  spellCheck: false,
  autoCorrect: "off",
  autoCapitalize: "off",
  "data-gramm": "false",
  "data-gramm_editor": "false",
  "data-enable-grammarly": "false",
} as const;

const HTML_ATTRS: Record<string, string> = {
  spellcheck: "false",
  autocorrect: "off",
  autocapitalize: "off",
  "data-gramm": "false",
  "data-gramm_editor": "false",
  "data-enable-grammarly": "false",
};

export function applySpellcheckGuard(element: Element) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  for (const [key, value] of Object.entries(HTML_ATTRS)) {
    element.setAttribute(key, value);
  }
}

export function applySpellcheckGuardToTree(root: ParentNode) {
  if (root instanceof HTMLElement && root.matches(SPELLCHECK_GUARD_SELECTOR)) {
    applySpellcheckGuard(root);
  }

  root.querySelectorAll(SPELLCHECK_GUARD_SELECTOR).forEach(applySpellcheckGuard);
  root.querySelectorAll(EDITOR_BLOCK_SELECTOR).forEach(applySpellcheckGuard);
}
