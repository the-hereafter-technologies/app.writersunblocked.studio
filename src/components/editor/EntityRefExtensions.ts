import { nestApiRequest } from "@/lib/nest-api";
import Mention from "@tiptap/extension-mention";
import type { Editor } from "@tiptap/react";

interface MentionSuggestion {
  id: string;
  name: string;
  mentionType: "person" | "place" | "thing";
  mentionCount?: number;
  color?: string;
  description?: string;
}

type RefCommandContext = {
  editor: Editor;
  range: { from: number; to: number };
};

type BuildExtensionsParams = {
  storyId: string;
  onNewMention: (query: string, context: RefCommandContext) => void;
};

type SuggestionCommandProps = {
  id?: string | null;
  name?: string;
  color?: string;
  mentionType?: "person" | "place" | "thing";
};

type SuggestionCommandContext = {
  editor: Editor;
  range: { from: number; to: number };
  props: SuggestionCommandProps;
};

const NEW_MENTION_SENTINEL = "__new_mention__";

function normalizeColor(color?: string) {
  if (!color) return "amber";
  return color;
}

async function listMentions(storyId: string) {
  return nestApiRequest<MentionSuggestion[]>({
    path: `/stories/${storyId}/mentions?status=confirmed`,
  });
}

export function buildEntityRefExtensions({
  storyId,
  onNewMention,
}: BuildExtensionsParams) {
  const buildSuggestionItems = async (query: string) => {
    try {
      const items = await listMentions(storyId);

      const filtered = (items ?? []).filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      return [
        ...filtered,
        {
          id: NEW_MENTION_SENTINEL,
          name: query || "New mention…",
          color: "amber",
        },
      ];
    } catch {
      return [
        {
          id: NEW_MENTION_SENTINEL,
          name: query || "New mention…",
          color: "amber",
        },
      ];
    }
  };

  const runSuggestionCommand = ({
    editor,
    range,
    props,
  }: SuggestionCommandContext) => {
    if (props?.id === NEW_MENTION_SENTINEL) {
      onNewMention(props?.name === "New mention…" ? "" : (props?.name ?? ""), {
        editor,
        range,
      });
      return;
    }

    const mentionType = props.mentionType ?? "thing";

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: "mentionRef",
          attrs: {
            id: props.id,
            label: props.name,
            color: normalizeColor(props.color),
            mentionType,
          },
        },
        { type: "text", text: " " },
      ])
      .run();
  };

  const MentionRef = Mention.extend({
    name: "mentionRef",
  }).configure({
    HTMLAttributes: {
      class: "mention-ref",
    },
    suggestion: {
      char: "@",
      items: async ({ query }: { query: string }) =>
        buildSuggestionItems(query),
      command: runSuggestionCommand,
    },
    renderText({ node }) {
      return `${node.attrs.label ?? node.attrs.id}`;
    },
    renderHTML({ node }) {
      const mentionType =
        node.attrs.mentionType === "person" ||
        node.attrs.mentionType === "place" ||
        node.attrs.mentionType === "thing"
          ? node.attrs.mentionType
          : "thing";
      const color = normalizeColor(node.attrs.color);
      return [
        "span",
        {
          "data-ref-type": mentionType,
          "data-ref-id": node.attrs.id,
          "data-ref-color": color,
          class: `entity-highlight-reference entity-highlight-reference-${mentionType}`,
        },
        `${node.attrs.label ?? node.attrs.id}`,
      ];
    },
  });

  return { MentionRef };
}
