export enum EditorMode {
  Writing = "writing",
  Developmental = "developmental",
  Scene = "scene",
  Line = "line",
  Copy = "copy",
}

export type ButtonAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "justifyFull"
  | "chapter"
  | "header"
  | "paragraph"
  | "entity-version"
  | "mention"
  | "tag"
  | "note"
  | "comment"
  | "interrogate"
  | "tension"
  | "continuity"
  // Developmental mode
  | "arc-map"
  | "character-goal-tracker"
  | "dead-zone-scan"
  | "thread-tracker"
  // Scene mode
  | "scene-purpose-check"
  | "scene-sequel-check"
  | "pov-scan"
  | "pacing-shape";
