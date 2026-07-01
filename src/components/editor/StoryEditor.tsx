"use client";

import { EditorBar } from "@/components/EditorBar";
import type { ButtonAction } from "@/components/EditorBar/types";
import { NestApiError, nestApiRequest } from "@/lib/nest-api";
import type { StoryboardCommentData, StoryMode } from "@/services/api/story";
import {
  getHighlightColorList,
  type HighlightBackgroundColors,
} from "@/services/hooks/useHighlightColors";
import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useStoryboard } from "../StoryBoard/hooks";
import {
  ChapterExtension,
  extractChaptersFromEditor,
} from "./ChapterExtension";
import { buildEntityRefExtensions } from "./EntityRefExtensions";
import { SceneBoundaryExtension } from "./SceneBoundaryExtension";
import { ScreenplayNodes } from "./ScreenplayExtension";
import type { CommentAnchor } from "./SelectionReferenceMarks";
import {
  CharacterReferenceMark,
  CommentHighlightExtension,
  commentHighlightKey,
  LocationReferenceMark,
} from "./SelectionReferenceMarks";

type RefCommandContext = {
  editor: Editor;
  range: { from: number; to: number };
};

interface ReferencePickerEntity {
  id: string;
  name: string;
  mentionType?: "person" | "place" | "thing";
  color?: string;
}

interface ReferencePickerState {
  type: "character" | "location";
  from: number;
  to: number;
  text: string;
  top: number;
  left: number;
}

interface CommentComposerState {
  from: number;
  to: number;
  text: string;
  anchorOffset: number;
  anchorLength: number;
  top: number;
  left: number;
}

interface MentionEntity {
  id: string;
  name: string;
  mentionType: "person" | "place" | "thing";
  status?: "pending" | "confirmed";
  mentionCount?: number;
  color?: string;
  description?: string;
  aliases?: unknown[];
  metadata?: Record<string, unknown> | null;
}

type MentionType = "person" | "place" | "thing";
type MentionColor = keyof HighlightBackgroundColors;

interface AutoLinkEntity {
  id: string;
  name: string;
  mentionType: MentionType;
  color?: string;
  aliases: string[];
}

interface AutoLinkTermCandidate {
  entityId: string;
  mentionType: MentionType;
  term: string;
  color?: string;
  occurrences: number;
}

interface AutoLinkMatch {
  from: number;
  to: number;
  mentionType: MentionType;
  entityId: string;
  color?: string;
  label: string;
}

interface StoryEditorProps {
  storyId: string;
  storyMode?: StoryMode;
  initialContent?: string;
  initialContentJSON?: unknown;
  savePath?: string;
  readOnly?: boolean;
  syncCharacterMentions?: boolean;
  onCharacterCreated?: (character: unknown) => void;
  onNewCharacterRequest?: (name: string, context: RefCommandContext) => void;
  onNewLocationRequest?: (name: string) => void;
  onSelectionReferenceCreateRequest?: (context: {
    type: "character" | "location";
    text: string;
    editor: Editor;
    range: { from: number; to: number };
  }) => void;
  onCreateSelectionComment?: (payload: {
    body: string;
    anchorOffset: number;
    anchorLength: number;
    anchorText: string;
  }) => Promise<void>;
  storyboardComments?: StoryboardCommentData[];
  onCommentAnchorClick?: (commentId: string) => void;
  onEditorReady?: (editor: Editor | null) => void;
  onEditorFocus?: (editor: Editor | null) => void;
  onEditorPointerDown?: () => void;
  onSelectionChange?: (from: number, to: number) => void;
  showEditorBar?: boolean;
  onChaptersChange?: (
    chapters: ReturnType<typeof extractChaptersFromEditor>
  ) => void;
  onPersisted?: () => void;
  onSaveDraft?: (payload: {
    content: string;
    contentJSON: unknown;
    wordCount: number;
  }) => Promise<void>;
}

const EditorWrapper = styled.div<{ $readOnly?: boolean }>`
  position: relative;
  width: 100%;

  .ProseMirror {
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: 16px;
    line-height: 2;
    color: ${({ theme }) => theme.palette.brand.black};
    background: ${({ theme }) => theme.palette.brand.paper};
    /* max-width: 680px; */
    margin: 0 auto;
    /* padding: 48px 32px; */
    min-height: 60vh;
    outline: none;
    caret-color: ${({ theme }) => theme.palette.brand.silver};
    padding-bottom: 50vh;
    padding-top: 25vh;


    ${({ $readOnly }) =>
      $readOnly &&
      css`
        opacity: 0.6;
        pointer-events: none;
        user-select: none;
      `}

    p {
      margin-bottom: 1.75rem;
      max-width: 680px;
      margin: 0 auto 0.75rem;
    }

    p[data-screenplay-type='sceneHeading'] {
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 700;
      margin: 1.4rem 0 1rem;
    }

    p[data-screenplay-type='characterCue'] {
      max-width: 68%;
      margin: 1.1rem auto 0.25rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    p[data-screenplay-type='parenthetical'] {
      max-width: 64%;
      margin: 0.1rem auto;
      color: ${({ theme }) => theme.palette.brand.silver};
      font-style: italic;
    }

    p[data-screenplay-type='dialogue'] {
      max-width: 64%;
      margin: 0.15rem auto 0.75rem;
      line-height: 1.65;
    }

    p[data-screenplay-type='action'] {
      margin: 0.8rem 0;
    }

    p[data-screenplay-type='transition'] {
      text-align: right;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.06em;
      margin: 0.9rem 0;
    }

    hr {
      border: none;
      border-top: 1px solid #000;
      margin: 18px 0;
      height: 0;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      color: ${({ theme }) => theme.palette.brand.paper};
      pointer-events: none;
      float: left;
      height: 0;
    }

    .entity-ref-character {
      background: ${({ theme }) => theme.palette.brand.saffron};
      color: ${({ theme }) => theme.palette.brand.black};
      cursor: pointer;
    }

    .entity-ref-location {
      background: ${({ theme }) => theme.palette.brand.saffron};
      color: ${({ theme }) => theme.palette.brand.black};
      cursor: pointer;
    }

    .entity-highlight-reference {
      cursor: pointer;
      border-radius: 4px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      transition: background-color 120ms ease, box-shadow 120ms ease;
    }

    .entity-highlight-reference[data-ref-type='person'],
    .entity-highlight-reference[data-ref-type='place'],
    .entity-highlight-reference[data-ref-type='thing'] {
      /* background: ${({ theme }) => theme.palette.brand.amber}; */
      color: ${({ theme }) => theme.palette.brand.harvest};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.harvest}40; */
    }

    .entity-highlight-reference[data-ref-color='amber'] {
      /* background: ${({ theme }) => theme.palette.brand.amber}; */
      color: ${({ theme }) => theme.palette.brand.harvest};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.harvest}40; */
    }

    .entity-highlight-reference[data-ref-color='sage'] {
      /* background: ${({ theme }) => theme.palette.brand.sage}; */
      color: ${({ theme }) => theme.palette.brand.moor};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.moor}40; */
    }

    .entity-highlight-reference[data-ref-color='dustyrose'] {
      /* background: ${({ theme }) => theme.palette.brand.dustyrose}; */
      color: ${({ theme }) => theme.palette.brand.blush};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.blush}40; */
    }

    .entity-highlight-reference[data-ref-color='periwinkle'] {
      /* background: ${({ theme }) => theme.palette.brand.periwinkle}; */
      color: ${({ theme }) => theme.palette.brand.inkwell};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.inkwell}40; */
    }

    .entity-highlight-reference[data-ref-color='lavender'] {
      /* background: ${({ theme }) => theme.palette.brand.lavender}; */
      color: ${({ theme }) => theme.palette.brand.thistle};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.thistle}40; */
    }

    .entity-highlight-reference[data-ref-color='peach'] {
      /* background: ${({ theme }) => theme.palette.brand.peach}; */
      color: ${({ theme }) => theme.palette.brand.ember};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.ember}40; */
    }

    .entity-highlight-reference[data-ref-color='mist'] {
      /* background: ${({ theme }) => theme.palette.brand.mist}; */
      color: ${({ theme }) => theme.palette.brand.shore};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.shore}40; */
    }

    .entity-highlight-reference[data-ref-color='sand'] {
      /* background: ${({ theme }) => theme.palette.brand.sand}; */
      color: ${({ theme }) => theme.palette.brand.dune};
      /* box-shadow: inset 0 -1px 0 ${({ theme }) => theme.palette.brand.dune}40; */
    }

    .entity-highlight-reference:hover {
      box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08);
    }

    .comment-highlight {
      cursor: pointer;
      background: ${({ theme }) => theme.palette.brand.periwinkle ?? "#dce4ff"};
      color: ${({ theme }) => theme.palette.brand.inkwell ?? "#1a237e"};
      border-radius: 2px;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      border-bottom: 2px solid ${({ theme }) => theme.palette.brand.inkwell ?? "#1a237e"}80;
      transition: background-color 120ms ease, box-shadow 120ms ease;

      &:hover {
        box-shadow: 0 0 0 1px ${({ theme }) => theme.palette.brand.inkwell ?? "#1a237e"}50;
      }
    }

    .comment-highlight--resolved {
      background: ${({ theme }) => theme.palette.brand.mist ?? "#e8e8e8"};
      color: ${({ theme }) => theme.palette.brand.shore ?? "#888"};
      border-bottom-color: ${({ theme }) => theme.palette.brand.shore ?? "#888"}80;
      opacity: 0.65;
    }
  }
`;

const StickyEditorBarSlot = styled.div`
  position: sticky;
  top: 0;
  z-index: 22;
  display: flex;
  justify-content: center;
  background: ${({ theme }) => theme.palette.brand.paper};
  padding: 8px 0;
`;

const RefMeta = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.paper};
`;

const SmallButton = styled.button`
  color: ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  font-size: 12px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.palette.brand.silver};
    color: ${({ theme }) => theme.palette.brand.silver};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.cancel {
    color: #dc2626;
  }
`;

const RefError = styled.p`
  margin: 0 0 8px;
  color: #dc2626;
  font-size: 12px;
`;

const SelectionReferencePicker = styled.div<{ $top: number; $left: number }>`
  position: absolute;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  transform: translateX(-50%);
  overflow: hidden;
  z-index: 28;
  width: 280px;
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
`;

const PickerContext = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
  font-style: italic;
  padding: 8px;
  background-color: ${({ theme }) => theme.palette.brand.paper};
  margin: 0;
`;

const PickerList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 220px;
  overflow-y: auto;
`;

const PickerRow = styled.button`
  color: ${({ theme }) => theme.palette.brand.black};
  text-align: left;
  font-size: 12px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  display: block;
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.palette.brand.silver};
    color: ${({ theme }) => theme.palette.brand.black};
    background-color: ${({ theme }) => theme.palette.brand.paper};
  }
`;

const PickerFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.palette.brand.paper};
  padding: 8px;
`;

const CommentComposer = styled.div<{ $top: number; $left: number }>`
  position: absolute;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  transform: translateX(-50%);
  z-index: 29;
  width: 320px;
  background: ${({ theme }) => theme.palette.brand.darkPaper};
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  padding: 10px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
`;

const CommentComposerTitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.black};
  font-weight: 600;
`;

const CommentComposerText = styled.p`
  margin: 4px 0 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.palette.brand.paper};
`;

const CommentComposerInput = styled.textarea`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.palette.brand.black};
  border-radius: 12px;
  background: ${({ theme }) => theme.palette.brand.paper};
  color: ${({ theme }) => theme.palette.brand.black};
  font-size: 12px;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  padding: 8px;
  min-height: 88px;
  resize: vertical;
`;

const AUTO_LINK_IDLE_MS = 12000;
const AUTO_LINK_TICK_MS = 5000;
const AUTO_LINK_ENTITY_REFRESH_MS = 45000;
const AUTO_LINK_MIN_OCCURRENCES = 2;
const AUTO_LINK_APPLY_COOLDOWN_MS = 4500;

type StoryDocNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: StoryDocNode[];
  content?: StoryDocNode[];
};

type StoryDocJson = {
  type?: string;
  content?: StoryDocNode[];
};

type ScreenplayBlockType =
  | "sceneHeading"
  | "characterCue"
  | "parenthetical"
  | "dialogue"
  | "action"
  | "transition";

const screenplayKeyboardFlow: Partial<
  Record<ScreenplayBlockType, ScreenplayBlockType>
> = {
  sceneHeading: "action",
  characterCue: "dialogue",
  parenthetical: "dialogue",
  dialogue: "characterCue",
  action: "characterCue",
  transition: "sceneHeading",
};

const getNodeAttrString = (node: StoryDocNode, key: string): string | null => {
  const value = node.attrs?.[key];
  return typeof value === "string" ? value : null;
};

const isWordChar = (char: string | undefined) => {
  if (!char) {
    return false;
  }

  return /[A-Za-z0-9_]/.test(char);
};

const hasWordBoundaries = (
  text: string,
  startIndex: number,
  termLength: number
) => {
  const before = startIndex > 0 ? text[startIndex - 1] : undefined;
  const after =
    startIndex + termLength < text.length
      ? text[startIndex + termLength]
      : undefined;

  return !isWordChar(before) && !isWordChar(after);
};

const findFirstWholeWordIndex = (text: string, term: string) => {
  if (!text || !term) {
    return -1;
  }

  const textLower = text.toLowerCase();
  const termLower = term.toLowerCase();

  let cursor = 0;
  while (cursor < textLower.length) {
    const matchIndex = textLower.indexOf(termLower, cursor);
    if (matchIndex < 0) {
      return -1;
    }

    if (hasWordBoundaries(text, matchIndex, term.length)) {
      return matchIndex;
    }

    cursor = matchIndex + 1;
  }

  return -1;
};

const countWholeWordOccurrences = (text: string, term: string) => {
  if (!text || !term) {
    return 0;
  }

  const textLower = text.toLowerCase();
  const termLower = term.toLowerCase();

  let cursor = 0;
  let total = 0;
  while (cursor < textLower.length) {
    const matchIndex = textLower.indexOf(termLower, cursor);
    if (matchIndex < 0) {
      break;
    }

    if (hasWordBoundaries(text, matchIndex, term.length)) {
      total += 1;
      cursor = matchIndex + term.length;
      continue;
    }

    cursor = matchIndex + 1;
  }

  return total;
};

const extractAliasText = (aliases: unknown[]): string[] => {
  return aliases
    .map((alias) => {
      if (typeof alias === "string") {
        return alias;
      }

      if (alias && typeof alias === "object") {
        const text = (alias as { text?: unknown }).text;
        if (typeof text === "string") {
          return text;
        }

        const label = (alias as { label?: unknown }).label;
        if (typeof label === "string") {
          return label;
        }

        const name = (alias as { name?: unknown }).name;
        if (typeof name === "string") {
          return name;
        }
      }

      return "";
    })
    .map((value) => value.trim())
    .filter((value) => value.length >= 2);
};

const promptMentionType = (
  defaultType: MentionType = "person"
): MentionType | null => {
  const raw = window
    .prompt("Mention type (person, place, thing)", defaultType)
    ?.trim()
    .toLowerCase();

  if (!raw) {
    return null;
  }

  if (raw === "person" || raw === "place" || raw === "thing") {
    return raw;
  }

  window.alert("Mention type must be one of: person, place, thing");
  return null;
};

const promptMentionColor = (
  defaultColor: MentionColor = "amber"
): MentionColor | null => {
  const colors = getHighlightColorList() as MentionColor[];
  const raw = window
    .prompt(`Mention color (${colors.join(", ")})`, defaultColor)
    ?.trim()
    .toLowerCase();

  if (!raw) {
    return null;
  }

  if (colors.includes(raw as MentionColor)) {
    return raw as MentionColor;
  }

  window.alert(`Mention color must be one of: ${colors.join(", ")}`);
  return null;
};

const promptMentionDraft = (
  defaultName: string,
  defaultType: MentionType = "person"
): { name: string; mentionType: MentionType; color: MentionColor } | null => {
  const name =
    defaultName.trim() || window.prompt("New mention name")?.trim() || "";

  if (!name) {
    return null;
  }

  const mentionType = promptMentionType(defaultType);
  if (!mentionType) {
    return null;
  }

  const color = promptMentionColor("amber");
  if (!color) {
    return null;
  }

  return { name, mentionType, color };
};

const toMentionType = (value: string | undefined): MentionType | undefined => {
  if (value === "person" || value === "place" || value === "thing") {
    return value;
  }

  return undefined;
};

function extractPlainText(json: StoryDocJson): string {
  if (!json?.content) return "";
  return json.content
    .map((node: StoryDocNode) => {
      if (node.type === "text") return node.text ?? "";
      if (
        node.type === "mention" ||
        node.type === "mentionRef" ||
        node.type === "characterRef" ||
        node.type === "locationRef"
      ) {
        return (
          getNodeAttrString(node, "label") ??
          getNodeAttrString(node, "id") ??
          ""
        );
      }
      if (node.type === "chapter")
        return `${getNodeAttrString(node, "title") ?? "Untitled Chapter"}\n`;
      if (node.content) return extractPlainText(node);
      return "\n";
    })
    .join("");
}

function countCharacterRefs(json: StoryDocJson): Record<string, number> {
  const counts: Record<string, number> = {};
  if (!json?.content) return counts;

  const traverse = (node: StoryDocNode) => {
    if (
      (node.type === "mention" ||
        node.type === "mentionRef" ||
        node.type === "characterRef") &&
      typeof getNodeAttrString(node, "id") === "string"
    ) {
      const id = getNodeAttrString(node, "id") as string;
      counts[id] = (counts[id] ?? 0) + 1;
    }

    if (Array.isArray(node.marks)) {
      node.marks.forEach((mark: StoryDocNode) => {
        if (
          (mark.type === "mention" ||
            mark.type === "mentionRef" ||
            mark.type === "characterRef" ||
            mark.type === "characterReference") &&
          typeof getNodeAttrString(mark, "id") === "string"
        ) {
          const id = getNodeAttrString(mark, "id") as string;
          counts[id] = (counts[id] ?? 0) + 1;
        }
      });
    }

    if (node.content) node.content.forEach(traverse);
  };

  json.content.forEach(traverse);
  return counts;
}

function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export default function StoryEditor({
  storyId,
  storyMode = "novel",
  initialContent,
  initialContentJSON,
  savePath,
  readOnly = false,
  syncCharacterMentions = true,
  onNewCharacterRequest,
  onNewLocationRequest,
  onSelectionReferenceCreateRequest,
  onCreateSelectionComment,
  storyboardComments,
  onCommentAnchorClick,
  onEditorReady,
  onEditorFocus,
  onEditorPointerDown,
  onSelectionChange,
  showEditorBar = true,
  onChaptersChange,
  onPersisted,
  onSaveDraft,
}: StoryEditorProps) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const pendingSaveJsonRef = useRef<StoryDocJson | null>(null);
  const flushInFlightRef = useRef<Promise<void> | null>(null);
  const previousMentionCountsRef = useRef<Record<string, number>>({});
  const previousProseHashRef = useRef<string>("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const [referencePicker, setReferencePicker] =
    useState<ReferencePickerState | null>(null);
  const [pickerItems, setPickerItems] = useState<ReferencePickerEntity[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [commentComposer, setCommentComposer] =
    useState<CommentComposerState | null>(null);
  const [commentBodyDraft, setCommentBodyDraft] = useState("");
  const [commentComposerSaving, setCommentComposerSaving] = useState(false);
  const [commentComposerError, setCommentComposerError] = useState<
    string | null
  >(null);
  const autoLinkEntitiesRef = useRef<AutoLinkEntity[]>([]);
  const autoLinkInFlightRef = useRef(false);
  const lastEntityRefreshAtRef = useRef(0);
  const lastUserInteractionAtRef = useRef(Date.now());
  const lastAutoLinkAtRef = useRef(0);
  const { isStoryboardOpen } = useStoryboard();

  const loadAutoLinkEntities = useCallback(
    async (force = false) => {
      const shouldRefresh =
        force ||
        Date.now() - lastEntityRefreshAtRef.current >
          AUTO_LINK_ENTITY_REFRESH_MS;

      if (!shouldRefresh && autoLinkEntitiesRef.current.length > 0) {
        return;
      }

      try {
        const mentions = await nestApiRequest<MentionEntity[]>({
          path: `/stories/${storyId}/mentions?status=confirmed`,
        });

        const entities: AutoLinkEntity[] = Array.isArray(mentions)
          ? mentions
              .filter((mention) => mention.mentionType)
              .map((mention) => ({
                id: mention.id,
                name: mention.name,
                mentionType: mention.mentionType,
                color: mention.color,
                aliases: extractAliasText(
                  Array.isArray(mention.aliases) ? mention.aliases : []
                ),
              }))
          : [];

        autoLinkEntitiesRef.current = entities;
        lastEntityRefreshAtRef.current = Date.now();
      } catch {
        // Keep the last known entity list; auto-linking can try again later.
      }
    },
    [storyId]
  );

  const applyNextAutoLink = useCallback((currentEditor: Editor): boolean => {
    const entities = autoLinkEntitiesRef.current;
    if (entities.length === 0) {
      return false;
    }

    const docText = currentEditor.state.doc.textBetween(
      0,
      currentEditor.state.doc.content.size,
      " "
    );
    if (!docText.trim()) {
      return false;
    }

    const candidateMap = new Map<string, AutoLinkTermCandidate>();

    for (const entity of entities) {
      const terms = [entity.name, ...entity.aliases]
        .map((value) => value.trim())
        .filter((value) => value.length >= 2);

      for (const term of terms) {
        const normalizedTerm = term.toLowerCase();
        const key = `${entity.id}:${normalizedTerm}`;
        if (candidateMap.has(key)) {
          continue;
        }

        const occurrences = countWholeWordOccurrences(docText, term);
        if (occurrences < AUTO_LINK_MIN_OCCURRENCES) {
          continue;
        }

        candidateMap.set(key, {
          entityId: entity.id,
          mentionType: entity.mentionType,
          term,
          color: entity.color,
          occurrences,
        });
      }
    }

    const candidates = [...candidateMap.values()].sort((left, right) => {
      if (left.occurrences !== right.occurrences) {
        return right.occurrences - left.occurrences;
      }

      return right.term.length - left.term.length;
    });

    if (candidates.length === 0) {
      return false;
    }

    const skipMarkTypes = new Set([
      "characterReference",
      "locationReference",
      "mentionRef",
      "characterRef",
      "locationRef",
      "mention",
    ]);

    let nextMark: AutoLinkMatch | undefined;

    currentEditor.state.doc.descendants((node, pos) => {
      if (nextMark) {
        return false;
      }

      if (!node.isText || typeof node.text !== "string") {
        return true;
      }

      const hasReferenceMark = node.marks.some((mark) =>
        skipMarkTypes.has(mark.type.name)
      );
      if (hasReferenceMark) {
        return true;
      }

      for (const candidate of candidates) {
        const matchIndex = findFirstWholeWordIndex(node.text, candidate.term);
        if (matchIndex < 0) {
          continue;
        }

        const from = pos + matchIndex;
        const to = from + candidate.term.length;

        nextMark = {
          from,
          to,
          mentionType: candidate.mentionType,
          entityId: candidate.entityId,
          color: candidate.color,
          label: node.text.slice(
            matchIndex,
            matchIndex + candidate.term.length
          ),
        };

        return false;
      }

      return true;
    });

    if (nextMark === undefined) {
      return false;
    }

    const selectedMark = nextMark;

    const markName =
      selectedMark.mentionType === "person"
        ? "characterReference"
        : "locationReference";

    currentEditor
      .chain()
      .setTextSelection({
        from: selectedMark.from,
        to: selectedMark.to,
      })
      .setMark(markName, {
        id: selectedMark.entityId,
        label: selectedMark.label,
        color:
          selectedMark.color ??
          (selectedMark.mentionType === "person" ? "purple" : "teal"),
        entityType: selectedMark.mentionType,
      })
      .run();

    return true;
  }, []);

  const persistSave = useCallback(
    async (json: StoryDocJson) => {
      const content = extractPlainText(json);
      const proseHash = hashString(content);
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      const mentionCounts = countCharacterRefs(json);
      const previousMentionCounts = previousMentionCountsRef.current;

      const allCharacterIds = new Set<string>([
        ...Object.keys(previousMentionCounts),
        ...Object.keys(mentionCounts),
      ]);
      const mentionCountsUnchanged = [...allCharacterIds].every(
        (characterId) =>
          (mentionCounts[characterId] ?? 0) ===
          (previousMentionCounts[characterId] ?? 0)
      );

      if (
        proseHash === previousProseHashRef.current &&
        mentionCountsUnchanged
      ) {
        return;
      }

      const payload = { content, contentJSON: json, wordCount };

      if (onSaveDraft) {
        await onSaveDraft(payload);
      } else {
        const path = savePath ?? `/stories/${storyId}`;

        try {
          await nestApiRequest({
            path,
            method: "PATCH",
            body: payload,
          });
        } catch (caughtError) {
          const fallbackPath = path.endsWith("/content")
            ? path
            : `${path}/content`;

          const shouldRetryWithAlternatePath =
            caughtError instanceof NestApiError &&
            caughtError.status === 404 &&
            path !== fallbackPath &&
            path.includes("/scenes/");

          if (!shouldRetryWithAlternatePath) {
            throw caughtError;
          }

          await nestApiRequest({
            path: fallbackPath,
            method: "PATCH",
            body: payload,
          });
        }
      }

      onPersisted?.();

      if (!syncCharacterMentions) {
        previousMentionCountsRef.current = mentionCounts;
        previousProseHashRef.current = proseHash;
        return;
      }

      await Promise.all(
        [...allCharacterIds].map(async (characterId) => {
          const count = mentionCounts[characterId] ?? 0;
          const previousCount = previousMentionCounts[characterId] ?? 0;
          const mentionChanged = count !== previousCount;

          if (mentionChanged) {
            await nestApiRequest({
              path: `/mentions/${characterId}`,
              method: "PATCH",
              body: { mentionCount: count },
            });
          }
        })
      );

      previousMentionCountsRef.current = mentionCounts;
      previousProseHashRef.current = proseHash;
    },
    [onPersisted, onSaveDraft, savePath, storyId, syncCharacterMentions]
  );

  const flushPendingSave = useCallback(async () => {
    if (readOnly) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    if (flushInFlightRef.current) {
      await flushInFlightRef.current;
      return;
    }

    const run = (async () => {
      // Drain latest pending drafts in sequence to avoid concurrent PATCH races.
      while (pendingSaveJsonRef.current) {
        const pendingJson = pendingSaveJsonRef.current;
        pendingSaveJsonRef.current = null;
        await persistSave(pendingJson);
      }
    })();

    flushInFlightRef.current = run;

    try {
      await run;
    } finally {
      if (flushInFlightRef.current === run) {
        flushInFlightRef.current = null;
      }
    }
  }, [persistSave, readOnly]);

  const closeCommentComposer = useCallback(() => {
    setCommentComposer(null);
    setCommentBodyDraft("");
    setCommentComposerSaving(false);
    setCommentComposerError(null);
  }, []);

  const handleNewMentionRequest = useCallback(
    async (
      query: string,
      context: { editor: Editor; range: { from: number; to: number } }
    ) => {
      const callbackSeed = query.trim();
      if (onNewCharacterRequest) {
        onNewCharacterRequest(callbackSeed, context);
        return;
      }

      if (onNewLocationRequest) {
        onNewLocationRequest(callbackSeed);
        return;
      }

      const draft = promptMentionDraft(callbackSeed, "thing");
      if (!draft) return;

      try {
        const mention = await nestApiRequest<{ id: string; name: string }>({
          path: `/stories/${storyId}/mentions`,
          method: "POST",
          body: {
            name: draft.name,
            mentionType: draft.mentionType,
            status: "confirmed",
            color: draft.color,
          },
        });

        context.editor
          .chain()
          .focus()
          .insertContentAt(context.range, [
            {
              type: "mentionRef",
              attrs: {
                id: mention.id,
                label: mention.name,
                color: draft.color,
                mentionType: draft.mentionType,
              },
            },
            { type: "text", text: " " },
          ])
          .run();
      } catch (err) {
        console.error("[editor] mention create error:", err);
      }
    },
    [onNewCharacterRequest, onNewLocationRequest, storyId]
  );

  const closeReferencePicker = useCallback(() => {
    setReferencePicker(null);
    setPickerItems([]);
    setPickerLoading(false);
    setPickerError(null);
  }, []);

  const applySelectionReference = useCallback(
    (entity: ReferencePickerEntity) => {
      const currentEditor = editorRef.current;
      if (!currentEditor || !referencePicker) return;

      const mentionType =
        entity.mentionType ??
        (referencePicker.type === "character" ? "person" : "place");

      const markName =
        mentionType === "person" ? "characterReference" : "locationReference";

      const didApply = currentEditor
        .chain()
        .focus()
        .setTextSelection({
          from: referencePicker.from,
          to: referencePicker.to,
        })
        .setMark(markName, {
          id: entity.id,
          label: referencePicker.text,
          color: entity.color ?? "amber",
          entityType: mentionType,
        })
        .run();

      closeReferencePicker();

      if (!didApply || readOnly) {
        return;
      }

      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }

      const json = currentEditor.getJSON();
      pendingSaveJsonRef.current = json;
      flushPendingSave().catch((err) =>
        console.error("[editor] selection reference save error:", err)
      );
    },
    [closeReferencePicker, flushPendingSave, readOnly, referencePicker]
  );

  const createAndAttachSelectionReference = useCallback(async () => {
    const currentEditor = editorRef.current;
    if (!referencePicker || !currentEditor) return;

    const seed = referencePicker.text.trim();
    if (!seed) return;

    if (onSelectionReferenceCreateRequest) {
      onSelectionReferenceCreateRequest({
        type: referencePicker.type,
        text: seed,
        editor: currentEditor,
        range: {
          from: referencePicker.from,
          to: referencePicker.to,
        },
      });
      closeReferencePicker();
      return;
    }

    setPickerLoading(true);
    setPickerError(null);

    try {
      const draft = promptMentionDraft(
        seed,
        referencePicker.type === "character" ? "person" : "place"
      );
      if (!draft) {
        return;
      }

      const created = await nestApiRequest<{
        id: string;
        name: string;
        color?: string;
        mentionType?: string;
      }>({
        path: `/stories/${storyId}/mentions`,
        method: "POST",
        body: {
          name: draft.name,
          mentionType: draft.mentionType as MentionType,
          status: "confirmed",
          color: draft.color,
        },
      });
      applySelectionReference({
        id: created.id,
        name: created.name,
        mentionType: (toMentionType(created.mentionType) ??
          draft.mentionType) as MentionType,
        color: created.color ?? draft.color,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create reference";
      setPickerError(message);
    } finally {
      setPickerLoading(false);
    }
  }, [
    applySelectionReference,
    closeReferencePicker,
    onSelectionReferenceCreateRequest,
    referencePicker,
    storyId,
  ]);

  const openSelectionReferencePicker = useCallback(
    async (type: "character" | "location") => {
      const currentEditor = editorRef.current;
      if (!currentEditor || !wrapperRef.current) return;

      const { from, to } = currentEditor.state.selection;
      if (from === to) return;

      const selectedText = currentEditor.state.doc
        .textBetween(from, to, " ")
        .trim();
      if (!selectedText) return;

      const start = currentEditor.view.coordsAtPos(from);
      const end = currentEditor.view.coordsAtPos(to);
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const left = (start.left + end.right) / 2 - wrapperRect.left;
      const top = Math.max(
        10,
        Math.max(start.bottom, end.bottom) - wrapperRect.top + 8
      );

      setReferencePicker({
        type,
        from,
        to,
        text: selectedText,
        top,
        left,
      });
      setPickerLoading(true);
      setPickerError(null);

      try {
        const path = `/stories/${storyId}/mentions?status=confirmed`;
        const items = await nestApiRequest<ReferencePickerEntity[]>({ path });
        setPickerItems(Array.isArray(items) ? items : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load references";
        setPickerError(message);
        setPickerItems([]);
      } finally {
        setPickerLoading(false);
      }
    },
    [storyId]
  );

  const { MentionRef } = buildEntityRefExtensions({
    storyId,
    onNewMention: handleNewMentionRequest,
  });

  const insertScreenplayBlock = useCallback(
    (
      type: Exclude<ScreenplayBlockType, "parenthetical" | "transition">,
      options?: { includeTemplateText?: boolean }
    ) => {
      if (readOnly) return;

      const currentEditor = editorRef.current;
      if (!currentEditor) return;

      const includeTemplateText = options?.includeTemplateText ?? true;

      const templateByType: Record<
        Exclude<ScreenplayBlockType, "parenthetical" | "transition">,
        JSONContent
      > = {
        sceneHeading: {
          type: "sceneHeading",
          content: includeTemplateText
            ? [{ type: "text", text: "INT. LOCATION - DAY" }]
            : [],
        },
        characterCue: {
          type: "characterCue",
          content: includeTemplateText
            ? [{ type: "text", text: "CHARACTER NAME" }]
            : [],
        },
        dialogue: {
          type: "dialogue",
          content: includeTemplateText
            ? [{ type: "text", text: "Dialogue..." }]
            : [],
        },
        action: {
          type: "action",
          content: includeTemplateText
            ? [{ type: "text", text: "Action description..." }]
            : [],
        },
      };

      currentEditor.chain().focus().insertContent(templateByType[type]).run();
    },
    [readOnly]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions:
      storyMode === "screenplay"
        ? [
            StarterKit.configure({
              heading: false,
            }),
            ...ScreenplayNodes,
            SceneBoundaryExtension,
            CharacterReferenceMark,
            LocationReferenceMark,
            CommentHighlightExtension,
            MentionRef,
          ]
        : [
            StarterKit,
            ChapterExtension.configure({
              readOnly,
            }),
            SceneBoundaryExtension,
            CharacterReferenceMark,
            LocationReferenceMark,
            CommentHighlightExtension,
            MentionRef,
          ],
    content: initialContentJSON ?? initialContent ?? "",
    editable: !readOnly,
    editorProps: {
      attributes: {
        spellcheck: "false",
        autocorrect: "off",
        autocapitalize: "off",
        "data-gramm": "false",
        "data-gramm_editor": "false",
        "data-enable-grammarly": "false",
        "data-placeholder":
          storyMode === "screenplay"
            ? "Begin your screenplay... add mentions as highlighted nouns."
            : "Begin your story... add mentions as highlighted nouns.",
      },
      handleKeyDown: (_view, event) => {
        if (storyMode !== "screenplay" || readOnly) {
          return false;
        }

        if (
          event.key !== "Enter" ||
          event.shiftKey ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        ) {
          return false;
        }

        const currentEditor = editorRef.current;
        if (!currentEditor?.state.selection.empty) {
          return false;
        }

        const currentNodeType = currentEditor.state.selection.$from.parent.type
          .name as ScreenplayBlockType;
        const nextNodeType = screenplayKeyboardFlow[currentNodeType];

        if (!nextNodeType) {
          return false;
        }

        if (nextNodeType === "parenthetical" || nextNodeType === "transition") {
          return false;
        }

        event.preventDefault();
        insertScreenplayBlock(nextNodeType, { includeTemplateText: false });
        return true;
      },
    },
    onSelectionUpdate({ editor }) {
      const sel = editor.state.selection;
      if (!sel.empty) {
        onSelectionChangeRef.current?.(sel.from, sel.to);
      }
    },
    onUpdate({ editor }) {
      lastUserInteractionAtRef.current = Date.now();
      onChaptersChange?.(extractChaptersFromEditor(editor));

      if (readOnly) return;
      const json = editor.getJSON();
      closeReferencePicker();
      closeCommentComposer();

      if (saveTimer.current) clearTimeout(saveTimer.current);
      pendingSaveJsonRef.current = json;
      saveTimer.current = setTimeout(() => {
        flushPendingSave().catch((err) =>
          console.error("[editor] save error:", err)
        );
      }, 3000);
    },
  });

  useEffect(() => {
    if (!editor) return;

    editorRef.current = editor;

    onEditorReady?.(editor);
    onChaptersChange?.(extractChaptersFromEditor(editor));
    const initialJson = editor.getJSON();
    previousMentionCountsRef.current = countCharacterRefs(initialJson);
    previousProseHashRef.current = hashString(extractPlainText(initialJson));

    const handleFocus = () => {
      onEditorFocus?.(editor);
    };

    const handleBlur = () => {
      onEditorFocus?.(null);
      void flushPendingSave().catch((err) =>
        console.error("[editor] blur save error:", err)
      );
    };

    editor.on("focus", handleFocus);
    editor.on("blur", handleBlur);

    return () => {
      editorRef.current = null;
      void flushPendingSave().catch((err) =>
        console.debug("[editor] unmount save skipped/failed:", err)
      );
      editor.off("focus", handleFocus);
      editor.off("blur", handleBlur);
      onEditorFocus?.(null);
      onEditorReady?.(null);
    };
  }, [
    editor,
    flushPendingSave,
    onChaptersChange,
    onEditorFocus,
    onEditorReady,
  ]);

  useEffect(() => {
    if (readOnly) {
      return;
    }

    const handlePageHide = () => {
      void flushPendingSave().catch((err) =>
        console.debug("[editor] pagehide save skipped/failed:", err)
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") {
        return;
      }

      void flushPendingSave().catch((err) =>
        console.debug("[editor] visibility save skipped/failed:", err)
      );
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [flushPendingSave, readOnly]);

  useEffect(() => {
    const handleUserActivity = () => {
      lastUserInteractionAtRef.current = Date.now();
    };

    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("pointerdown", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);

    return () => {
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    if (readOnly) {
      return;
    }

    let isDisposed = false;

    const runIdleAutoLink = async () => {
      const currentEditor = editorRef.current;
      if (!currentEditor || isDisposed) {
        return;
      }

      if (document.hidden || !currentEditor.isFocused || referencePicker) {
        return;
      }

      // Don't run auto-link when the user has gone idle.
      if (Date.now() - lastUserInteractionAtRef.current > AUTO_LINK_IDLE_MS) {
        return;
      }

      if (
        Date.now() - lastAutoLinkAtRef.current <
        AUTO_LINK_APPLY_COOLDOWN_MS
      ) {
        return;
      }

      if (autoLinkInFlightRef.current) {
        return;
      }

      autoLinkInFlightRef.current = true;

      try {
        if (!isStoryboardOpen) {
          return;
        }
        await loadAutoLinkEntities();
        if (isDisposed) {
          return;
        }

        const applied = applyNextAutoLink(currentEditor);
        if (applied) {
          lastAutoLinkAtRef.current = Date.now();
        }
      } finally {
        autoLinkInFlightRef.current = false;
      }
    };

    const interval = window.setInterval(() => {
      void runIdleAutoLink();
    }, AUTO_LINK_TICK_MS);

    return () => {
      isDisposed = true;
      window.clearInterval(interval);
    };
  }, [
    applyNextAutoLink,
    loadAutoLinkEntities,
    readOnly,
    referencePicker,
    isStoryboardOpen,
  ]);

  const openSelectionCommentComposer = useCallback(() => {
    const currentEditor = editorRef.current;
    if (!currentEditor || !wrapperRef.current || !onCreateSelectionComment) {
      return;
    }

    const { from, to } = currentEditor.state.selection;
    if (from === to) {
      return;
    }

    const selectedText = currentEditor.state.doc
      .textBetween(from, to, " ")
      .trim();
    if (!selectedText) {
      return;
    }

    const offsetText = currentEditor.state.doc.textBetween(0, from, " ");
    const start = currentEditor.view.coordsAtPos(from);
    const end = currentEditor.view.coordsAtPos(to);
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    setCommentComposer({
      from,
      to,
      text: selectedText,
      anchorOffset: offsetText.length,
      anchorLength: selectedText.length,
      top: Math.max(
        10,
        Math.max(start.bottom, end.bottom) - wrapperRect.top + 8
      ),
      left: (start.left + end.right) / 2 - wrapperRect.left,
    });
    setCommentBodyDraft("");
    setCommentComposerError(null);
    closeReferencePicker();
  }, [closeReferencePicker, onCreateSelectionComment]);

  const submitSelectionComment = useCallback(async () => {
    if (
      !commentComposer ||
      !onCreateSelectionComment ||
      commentComposerSaving
    ) {
      return;
    }

    const body = commentBodyDraft.trim();
    if (!body) {
      setCommentComposerError("Comment body is required");
      return;
    }

    setCommentComposerSaving(true);
    setCommentComposerError(null);

    try {
      await onCreateSelectionComment({
        body,
        anchorOffset: commentComposer.anchorOffset,
        anchorLength: commentComposer.anchorLength,
        anchorText: commentComposer.text,
      });
      closeCommentComposer();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create comment";
      setCommentComposerError(message);
    } finally {
      setCommentComposerSaving(false);
    }
  }, [
    closeCommentComposer,
    commentBodyDraft,
    commentComposer,
    commentComposerSaving,
    onCreateSelectionComment,
  ]);

  // Sync comment anchor decorations whenever the comment list changes.
  useEffect(() => {
    if (!editor) return;

    const anchors: CommentAnchor[] = (storyboardComments ?? [])
      .filter(
        (c) => c.anchorText != null && c.anchorLength != null && !c.parentId
      )
      .map((c) => ({
        commentId: c.id,
        anchorText: c.anchorText as string,
        anchorOffset: c.anchorOffset ?? 0,
        anchorLength: c.anchorLength as number,
        isResolved: c.resolvedAt != null,
      }));

    editor.view.dispatch(editor.state.tr.setMeta(commentHighlightKey, anchors));
  }, [editor, storyboardComments]);

  // Handle clicks on comment-highlight spans.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !onCommentAnchorClick) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest("[data-comment-id]");
      if (!el) return;
      const commentId = el.getAttribute("data-comment-id");
      if (commentId) {
        onCommentAnchorClick(commentId);
      }
    };

    wrapper.addEventListener("click", handleClick);
    return () => wrapper.removeEventListener("click", handleClick);
  }, [onCommentAnchorClick]);

  const handleAddChapter = useCallback(() => {
    if (!editor || readOnly) return;
    if (storyMode === "screenplay") {
      insertScreenplayBlock("sceneHeading");
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: "chapter",
          attrs: {
            title: "Untitled Chapter",
          },
        },
        {
          type: "paragraph",
        },
      ])
      .run();
  }, [editor, insertScreenplayBlock, readOnly, storyMode]);

  const handleEditorBarAction = useCallback(
    (action: ButtonAction) => {
      if (!editor || readOnly) {
        return;
      }

      switch (action) {
        case "bold":
          editor.chain().focus().toggleBold().run();
          return;
        case "italic":
          editor.chain().focus().toggleItalic().run();
          return;
        case "strikethrough":
          editor.chain().focus().toggleStrike().run();
          return;
        case "header":
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          return;
        case "paragraph":
          editor.chain().focus().setParagraph().run();
          return;
        case "chapter":
          handleAddChapter();
          return;
        case "mention":
          void openSelectionReferencePicker("character");
          return;
        case "tag":
          void openSelectionReferencePicker("location");
          return;
        case "comment":
          openSelectionCommentComposer();
          return;
        default:
          return;
      }
    },
    [
      editor,
      handleAddChapter,
      openSelectionCommentComposer,
      openSelectionReferencePicker,
      readOnly,
    ]
  );

  return (
    <EditorWrapper
      ref={wrapperRef}
      $readOnly={readOnly}
      onMouseDownCapture={() => onEditorPointerDown?.()}
    >
      {showEditorBar ? (
        <StickyEditorBarSlot>
          <EditorBar onActionClick={handleEditorBarAction} />
        </StickyEditorBarSlot>
      ) : null}
      {commentComposer && (
        <CommentComposer
          $top={commentComposer.top}
          $left={commentComposer.left}
        >
          <CommentComposerTitle>Create Comment</CommentComposerTitle>
          <CommentComposerText>"{commentComposer.text}"</CommentComposerText>
          {commentComposerError && <RefError>{commentComposerError}</RefError>}
          <CommentComposerInput
            value={commentBodyDraft}
            onChange={(event) => setCommentBodyDraft(event.target.value)}
            placeholder="Add feedback for this highlighted text"
          />
          <PickerFooter>
            <SmallButton
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                closeCommentComposer();
              }}
              disabled={commentComposerSaving}
            >
              Cancel
            </SmallButton>
            <SmallButton
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                void submitSelectionComment();
              }}
              disabled={commentComposerSaving}
            >
              {commentComposerSaving ? "Saving..." : "Save comment"}
            </SmallButton>
          </PickerFooter>
        </CommentComposer>
      )}
      {referencePicker && (
        <SelectionReferencePicker
          $top={referencePicker.top}
          $left={referencePicker.left}
        >
          <PickerContext>"{referencePicker.text}"</PickerContext>
          {pickerError && <RefError>{pickerError}</RefError>}
          {pickerLoading ? (
            <RefMeta>Loading...</RefMeta>
          ) : (
            <PickerList>
              {pickerItems.map((item) => (
                <PickerRow
                  key={item.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applySelectionReference(item);
                  }}
                >
                  {item.name}
                </PickerRow>
              ))}
              {pickerItems.length === 0 && (
                <RefMeta>No existing {referencePicker.type}s yet</RefMeta>
              )}
            </PickerList>
          )}
          <PickerFooter>
            <SmallButton
              className="cancel"
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                closeReferencePicker();
              }}
            >
              Cancel
            </SmallButton>
            <SmallButton
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                createAndAttachSelectionReference();
              }}
              disabled={pickerLoading}
            >
              {pickerLoading
                ? "Creating..."
                : `[+] New ${referencePicker.type}`}
            </SmallButton>
          </PickerFooter>
        </SelectionReferencePicker>
      )}
      <EditorContent editor={editor} />
    </EditorWrapper>
  );
}
