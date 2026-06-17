import type { ApiScene } from "@/services/api/story";
import type { HighlightKeys } from "@writersunblocked/ui";
import type { SceneSettings, StoryScene } from "@writersunblocked/ui";
import type { Scene } from "@/services/api/story";

const POV_MAP: Record<string, SceneSettings["pov"]> = {
  first: "first-person",
  second: "second-person",
  third: "third-person",
  "first-person": "first-person",
  "second-person": "second-person",
  "third-person": "third-person",
};

const TENSE_MAP: Record<string, SceneSettings["tense"]> = {
  present: "present-tense",
  past: "past-tense",
  "present-tense": "present-tense",
  "past-tense": "past-tense",
};

const mapSceneSettings = (
  settings?: ApiScene["settings"]
): SceneSettings => ({
  pov: POV_MAP[settings?.pov ?? "first"] ?? "first-person",
  tense: TENSE_MAP[settings?.tense ?? "present"] ?? "present-tense",
  perspective: settings?.perspective ?? undefined,
});

export const mapApiSceneToStoryScene = (scene: ApiScene): StoryScene => ({
  id: scene.id,
  shortId: scene.shortId,
  label: scene.label ?? "Untitled Scene",
  order: scene.order,
  activeVersionId: scene.activeVersionId ?? "",
  color: (scene.color ?? "amber") as HighlightKeys,
  settings: mapSceneSettings(scene.settings),
  versions: (scene.versions ?? []).map((version) => ({
    id: version.id,
    shortId: version.shortId,
    label: version.shortId,
    data: version.data,
    plainText: version.plainText ?? "",
    wordCount: version.wordCount ?? 0,
  })),
});

export const mapApiScenesToStoryScenes = (scenes: ApiScene[]): StoryScene[] =>
  scenes
    .filter((scene) => scene.visible !== false)
    .sort((left, right) => left.order - right.order)
    .map(mapApiSceneToStoryScene);

export const mapApiSceneToStudioScene = (scene: ApiScene): Scene => {
  const activeVersion = scene.versions?.find(
    (version) => version.id === scene.activeVersionId
  );

  return {
    id: scene.id,
    shortId: scene.shortId,
    title: scene.label ?? "Untitled Scene",
    order: scene.order,
    visible: scene.visible ?? true,
    wordCount: activeVersion?.wordCount ?? 0,
    color: (scene.color ?? "amber") as Scene["color"],
    threadCount: scene.threadCount ?? 0,
    mentionCount: scene.mentionCount ?? 0,
    chapters: [],
    notes: scene.notes ?? [],
    mentions: scene.mentions ?? [],
    comments: scene.comments ?? [],
    label: scene.label ?? undefined,
    activeVersionId: scene.activeVersionId ?? undefined,
    settings: scene.settings,
    versions: scene.versions,
  };
};

export const mapApiScenesToStudioScenes = (scenes: ApiScene[]): Scene[] =>
  scenes
    .sort((left, right) => left.order - right.order)
    .map(mapApiSceneToStudioScene);
