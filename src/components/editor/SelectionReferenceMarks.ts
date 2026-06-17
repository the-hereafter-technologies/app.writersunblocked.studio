import {
  amber,
  blush,
  dune,
  dustyrose,
  ember,
  harvest,
  inkwell,
  lavender,
  mist,
  moor,
  peach,
  periwinkle,
  sage,
  sand,
  shore,
  thistle,
} from "@/theme/colors";
import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

type MentionEntityType = "person" | "place" | "thing";
type LegacyEntityType = "character" | "location";
type EntityType = MentionEntityType | LegacyEntityType;

type ReferenceAttrs = {
  id: string;
  label: string;
  color?: string;
  entityType: EntityType;
};

const DEFAULT_HIGHLIGHT_COLOR = "amber";

function normalizeEntityType(
  value: string | null | undefined,
  fallback: MentionEntityType
): MentionEntityType {
  if (value === "person" || value === "place" || value === "thing") {
    return value;
  }

  if (value === "character") {
    return "person";
  }

  if (value === "location") {
    return "place";
  }

  return fallback;
}

const COLOR_MAP: Record<string, { background: string; text: string }> = {
  amber: { background: amber, text: harvest },
  sage: { background: sage, text: moor },
  dustyrose: { background: dustyrose, text: blush },
  periwinkle: { background: periwinkle, text: inkwell },
  lavender: { background: lavender, text: thistle },
  peach: { background: peach, text: ember },
  mist: { background: mist, text: shore },
  sand: { background: sand, text: dune },
};

export function resolveColor(color: string | undefined) {
  return (
    COLOR_MAP[color ?? DEFAULT_HIGHLIGHT_COLOR] ??
    COLOR_MAP[DEFAULT_HIGHLIGHT_COLOR]
  );
}

function buildReferenceMark(
  name: "characterReference" | "locationReference",
  fallbackType: MentionEntityType
) {
  return Mark.create({
    name,
    inclusive: false,

    addAttributes() {
      return {
        id: { default: null },
        label: { default: null },
        color: { default: DEFAULT_HIGHLIGHT_COLOR },
        entityType: { default: fallbackType },
      };
    },

    parseHTML() {
      return [
        {
          tag: "span[data-ref-id]",
          getAttrs: (node) => {
            const element = node as HTMLElement;
            const rawType = element.getAttribute("data-ref-type");
            const allowedTypes =
              fallbackType === "person"
                ? ["person", "character"]
                : ["place", "thing", "location"];

            if (rawType && !allowedTypes.includes(rawType)) {
              return false;
            }

            const entityType = normalizeEntityType(rawType, fallbackType);

            return {
              id: element.getAttribute("data-ref-id"),
              label:
                element.getAttribute("data-ref-label") ??
                element.textContent ??
                "",
              color:
                element.getAttribute("data-ref-color") ??
                DEFAULT_HIGHLIGHT_COLOR,
              entityType,
            };
          },
        },
      ];
    },

    renderHTML({ mark, HTMLAttributes }) {
      const attrs = mark.attrs as ReferenceAttrs;
      const mentionType = normalizeEntityType(
        typeof attrs.entityType === "string" ? attrs.entityType : undefined,
        fallbackType
      );

      return [
        "span",
        mergeAttributes(HTMLAttributes, {
          "data-ref-id": attrs.id,
          "data-ref-label": attrs.label,
          "data-ref-type": mentionType,
          "data-ref-color": attrs.color,
          class: `entity-highlight-reference entity-highlight-reference-${mentionType}`,
        }),
        0,
      ];
    },
  });
}

export const CharacterReferenceMark = buildReferenceMark(
  "characterReference",
  "person"
);
export const LocationReferenceMark = buildReferenceMark(
  "locationReference",
  "place"
);

// ---------------------------------------------------------------------------
// Comment highlight decorations
// ---------------------------------------------------------------------------

export type CommentAnchor = {
  commentId: string;
  anchorText: string;
  anchorOffset: number;
  anchorLength: number;
  isResolved: boolean;
};

export const commentHighlightKey = new PluginKey<DecorationSet>(
  "commentHighlight"
);

/**
 * Find the ProseMirror `from`/`to` range for a comment anchor.
 *
 * Strategy: build a map of `charIndex → pmPos` by walking text nodes in
 * document order, then search for `anchorText` starting near `anchorOffset`.
 * This is resilient to minor position drift when the document changes.
 */
function findCommentRange(
  doc: PMNode,
  anchorText: string,
  anchorOffset: number,
  anchorLength: number
): { from: number; to: number } | null {
  // Build parallel arrays: positions[i] = pmPos of i-th character
  const positions: number[] = [];
  doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      for (let i = 0; i < node.text.length; i++) {
        positions.push(pos + i);
      }
    }
    return true;
  });

  const rawText = doc.textContent;
  if (!rawText || positions.length === 0) return null;

  // Search for anchorText starting near the stored offset (with slack for
  // block-separator drift between textBetween and textContent).
  const slack = 80;
  const searchStart = Math.max(0, anchorOffset - slack);
  let idx = rawText.indexOf(anchorText, searchStart);
  if (idx === -1) idx = rawText.indexOf(anchorText);
  if (idx === -1) return null;

  const endIdx = idx + anchorLength - 1;
  const from = positions[idx];
  const to =
    endIdx < positions.length
      ? positions[endIdx] + 1
      : positions[positions.length - 1] + 1;

  if (from === undefined || to === undefined || to <= from) return null;
  return { from, to };
}

export const CommentHighlightExtension = Extension.create({
  name: "commentHighlight",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: commentHighlightKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, set) {
            // Remap existing decorations when document changes
            set = set.map(tr.mapping, tr.doc);

            const anchors = tr.getMeta(commentHighlightKey) as
              | CommentAnchor[]
              | undefined;
            if (anchors === undefined) return set;

            const decorations: Decoration[] = [];
            for (const anchor of anchors) {
              if (!anchor.anchorText || !anchor.anchorLength) continue;
              const range = findCommentRange(
                tr.doc,
                anchor.anchorText,
                anchor.anchorOffset,
                anchor.anchorLength
              );
              if (!range) continue;
              decorations.push(
                Decoration.inline(range.from, range.to, {
                  class: anchor.isResolved
                    ? "comment-highlight comment-highlight--resolved"
                    : "comment-highlight",
                  "data-comment-id": anchor.commentId,
                })
              );
            }
            return DecorationSet.create(tr.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return commentHighlightKey.getState(state) ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },
});
