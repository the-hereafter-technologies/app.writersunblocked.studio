import type { StoryScene } from "@writersunblocked/ui";

export type SceneOrganizerSceneRow = {
  type: "scene";
  sceneId: string;
};

export type SceneOrganizerGroupRow = {
  type: "group";
  id: string;
  sceneIds: string[];
  label?: string;
};

export type SceneOrganizerRow = SceneOrganizerSceneRow | SceneOrganizerGroupRow;

export type SceneOrganizerValue = {
  rows: SceneOrganizerRow[];
};

export const parseSceneOrganizerValue = (
  metadata: Record<string, unknown> | null | undefined
): SceneOrganizerValue | undefined => {
  const organizer = metadata?.sceneOrganizer;

  if (!organizer || typeof organizer !== "object" || !("rows" in organizer)) {
    return undefined;
  }

  return organizer as SceneOrganizerValue;
};

export const buildStoryMetadata = (
  currentMetadata: Record<string, unknown> | null | undefined,
  sceneOrganizer: SceneOrganizerValue
) => ({
  ...(currentMetadata ?? {}),
  sceneOrganizer,
});

export const scenesToInitialValue = (scenes: StoryScene[]): SceneOrganizerValue => ({
  rows: [...scenes]
    .sort((left, right) => left.order - right.order)
    .map((scene) => ({
      type: "scene" as const,
      sceneId: scene.shortId,
    })),
});

export const appendSceneRow = (
  value: SceneOrganizerValue,
  sceneId: string
): SceneOrganizerValue => ({
  rows: [...value.rows, { type: "scene", sceneId }],
});

export const removeSceneFromOrganizer = (
  value: SceneOrganizerValue,
  sceneId: string
): SceneOrganizerValue => {
  const rows: SceneOrganizerRow[] = [];

  for (const row of value.rows) {
    if (row.type === "scene") {
      if (row.sceneId !== sceneId) {
        rows.push(row);
      }
      continue;
    }

    const nextSceneIds = row.sceneIds.filter((id) => id !== sceneId);

    if (nextSceneIds.length === 0) {
      continue;
    }

    if (nextSceneIds.length === 1) {
      rows.push({ type: "scene", sceneId: nextSceneIds[0] });
      continue;
    }

    rows.push({ ...row, sceneIds: nextSceneIds });
  }

  return { rows };
};

export const flattenSceneOrganizerOrder = (value: SceneOrganizerValue): string[] => {
  const shortIds: string[] = [];

  for (const row of value.rows) {
    if (row.type === "scene") {
      shortIds.push(row.sceneId);
      continue;
    }

    shortIds.push(...row.sceneIds);
  }

  return shortIds;
};

export const sortScenesByOrganizerOrder = <T extends { shortId: string; order: number }>(
  scenes: T[],
  value: SceneOrganizerValue
): T[] => {
  const order = flattenSceneOrganizerOrder(value);
  const orderIndex = new Map(order.map((shortId, index) => [shortId, index]));

  return [...scenes].sort((left, right) => {
    const leftIndex = orderIndex.get(left.shortId);
    const rightIndex = orderIndex.get(right.shortId);

    if (leftIndex !== undefined && rightIndex !== undefined) {
      return leftIndex - rightIndex;
    }

    if (leftIndex !== undefined) {
      return -1;
    }

    if (rightIndex !== undefined) {
      return 1;
    }

    return left.order - right.order;
  });
};
