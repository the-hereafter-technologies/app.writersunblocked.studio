import { mergeAttributes, Node } from "@tiptap/core";

type ScreenplayNodeName =
  | "sceneHeading"
  | "characterCue"
  | "parenthetical"
  | "dialogue"
  | "action"
  | "transition";

type ScreenplayNodeSpec = {
  name: ScreenplayNodeName;
  label: string;
  placeholder: string;
};

const screenplayNodes: ScreenplayNodeSpec[] = [
  {
    name: "sceneHeading",
    label: "Scene Heading",
    placeholder: "INT. LOCATION - DAY",
  },
  {
    name: "characterCue",
    label: "Character Cue",
    placeholder: "CHARACTER NAME",
  },
  {
    name: "parenthetical",
    label: "Parenthetical",
    placeholder: "(quietly)",
  },
  {
    name: "dialogue",
    label: "Dialogue",
    placeholder: "What is said...",
  },
  {
    name: "action",
    label: "Action",
    placeholder: "Describe the action...",
  },
  {
    name: "transition",
    label: "Transition",
    placeholder: "CUT TO:",
  },
];

const createScreenplayNode = ({
  name,
  label,
  placeholder,
}: ScreenplayNodeSpec) =>
  Node.create({
    name,
    group: "block",
    content: "inline*",
    defining: true,

    addAttributes() {
      return {
        screenplayType: {
          default: name,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: `p[data-screenplay-type="${name}"]`,
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "p",
        mergeAttributes(HTMLAttributes, {
          "data-screenplay-type": name,
          "data-screenplay-label": label,
          "data-placeholder": placeholder,
        }),
        0,
      ];
    },
  });

export const ScreenplayNodes = screenplayNodes.map(createScreenplayNode);
