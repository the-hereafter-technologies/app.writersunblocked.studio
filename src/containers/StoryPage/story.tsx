import { SceneEditor } from "@writersunblocked/ui";
import { useCallback, useEffect, useRef, type ComponentProps } from "react";
import { useStory } from "./provider";

type EditorValue = {
  data: unknown;
  plainText: string;
  wordCount: number;
};

const EditorStoryMode = {
  PROSE: "prose",
  SCREENPLAY: "screenplay",
} as const;

const getAutosaveKey = (sceneId: string) => `scene:${sceneId}`;

const hashJson = (value: unknown) => JSON.stringify(value ?? null);

const toEditorMode = (mode?: string) =>
  mode === "screenplay"
    ? EditorStoryMode.SCREENPLAY
    : EditorStoryMode.PROSE;

export const StoryContent = () => {
  const {
    orderedEditorScenes,
    story,
    scheduleAutosave,
    saveScene,
    updateSceneLabel,
    isReadOnly,
  } = useStory();
  const sceneHashesRef = useRef<Map<string, string>>(new Map());
  const storyIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!story) {
      return;
    }

    if (storyIdRef.current !== story.id) {
      sceneHashesRef.current = new Map();
      storyIdRef.current = story.id;
    }

    for (const scene of orderedEditorScenes) {
      if (sceneHashesRef.current.has(scene.id)) {
        continue;
      }

      const activeVersion = scene.versions?.find(
        (version) => version.id === scene.activeVersionId
      );

      sceneHashesRef.current.set(scene.id, hashJson(activeVersion?.data));
    }
  }, [orderedEditorScenes, story]);

  const handleSceneChange = useCallback(
    (sceneId: string, value: EditorValue) => {
      if (isReadOnly) {
        return;
      }

      const payload = {
        content: value.plainText,
        contentJSON: value.data,
        wordCount: value.wordCount,
      };
      const nextHash = hashJson(payload.contentJSON);
      const previousHash = sceneHashesRef.current.get(sceneId);

      if (nextHash === previousHash) {
        return;
      }

      const key = getAutosaveKey(sceneId);
      scheduleAutosave(key, async () => {
        await saveScene(sceneId, payload);
        sceneHashesRef.current.set(sceneId, nextHash);
      });
    },
    [isReadOnly, saveScene, scheduleAutosave]
  );

  const handleSceneTitleChange = useCallback(
    (sceneShortId: string, value?: string) => {
      if (isReadOnly || !value) {
        return;
      }

      updateSceneLabel(sceneShortId, value);
    },
    [isReadOnly, updateSceneLabel]
  );

  const sceneEditorProps = {
    mode: toEditorMode(story?.mode),
    scenes: orderedEditorScenes,
    onSceneChange: handleSceneChange,
    onSceneTitleChange: handleSceneTitleChange,
  } satisfies {
    mode: "prose" | "screenplay";
    scenes: typeof orderedEditorScenes;
    onSceneChange: typeof handleSceneChange;
    onSceneTitleChange: typeof handleSceneTitleChange;
  };

  return (
    <SceneEditor
      {...(sceneEditorProps as ComponentProps<typeof SceneEditor>)}
    />
  );
};
