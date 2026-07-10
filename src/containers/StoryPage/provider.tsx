"use client";

import { connectProgressSocket } from "@/lib/progress-socket";
import {
  analyzeSceneIntelligence,
  getIntelligenceThreads,
} from "@/services/api/intelligence";
import { connectIntelligenceSocket } from "@/services/sockets/intelligence.socket";
import {
  createScene,
  createMention,
  createStoryboardComment,
  deleteMention,
  deleteScene,
  deleteStoryboardComment,
  getMentions,
  getScenes,
  getStory,
  getStoryboardComments,
  patchSceneContent,
  patchScene,
  patchStory,
  patchStoryMetadata,
  patchStoryboardComment,
  reopenStoryboardComment,
  resolveStoryboardComment,
  updateSceneTitle,
  type ApiScene,
  type CreateScenePayload,
  type CreateStoryboardCommentPayload,
  type Scene,
  type SceneSavePayload,
  type StoryboardCommentData,
  type StoryData,
  type StorySavePayload,
} from "@/services/api/story";
import type { StoryMention, StoryScene } from "@writersunblocked/ui";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Socket } from "socket.io-client";
import {
  mapApiSceneToStoryScene,
  mapApiScenesToStoryScenes,
  mapApiScenesToStudioScenes,
} from "./map-scenes";
import {
  mapApiMentionToStoryMention,
  mapStoryMentionToCreatePayload,
  type ApiMention,
} from "./map-mention";
import {
  buildMentionOrganizerMetadata,
  EMPTY_MENTION_ORGANIZER_VALUE,
  parseMentionOrganizerValue,
  type MentionOrganizerValue,
} from "./mention-organizer-metadata";
import {
  appendSceneRow,
  buildStoryMetadata,
  flattenSceneOrganizerOrder,
  parseSceneOrganizerValue,
  removeSceneFromOrganizer,
  scenesToInitialValue,
  sortScenesByOrganizerOrder,
  type SceneOrganizerValue,
} from "./scene-organizer-metadata";

type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

type SaveState = "idle" | "saving" | "saved" | "error";

interface SaveStatusRecord {
  state: SaveState;
  error: string | null;
}

interface StoryContextType {
  storyId: string;
  story: StoryData | null;
  scenes: Scene[];
  editorScenes: StoryScene[];
  orderedEditorScenes: StoryScene[];
  sceneOrganizerValue: SceneOrganizerValue;
  mentionOrganizerValue: MentionOrganizerValue;
  mentions: StoryMention[];
  storyboardComments: StoryboardCommentData[];
  threadTotal: number;
  queueMessage: string | null;
  lastAnalysisDiagnostic: string | null;
  connectionState: ConnectionState;
  isLoading: boolean;
  error: Error | null;
  isReadOnly: boolean;
  saveStatusByKey: Record<string, SaveStatusRecord>;
  lastSavedAtByKey: Record<string, number | null>;
  refetchStory: () => Promise<StoryData | null>;
  loadScenes: () => Promise<void>;
  addScene: (payload?: CreateScenePayload) => Promise<ApiScene>;
  createSceneForOrganizer: (
    scene: Partial<StoryScene>
  ) => Promise<StoryScene | undefined>;
  handleSceneOrganizerChange: (value: SceneOrganizerValue) => void;
  handleMentionOrganizerChange: (value: MentionOrganizerValue) => void;
  createMentionForOrganizer: (
    draft: Partial<StoryMention>
  ) => Promise<void>;
  createGroupForOrganizer: (
    draft: Omit<StoryMention, "id">
  ) => Promise<StoryMention | undefined>;
  removeGroupFromOrganizer: (groupId: string) => Promise<void>;
  registerSceneInOrganizer: (sceneShortId: string) => void;
  updateSceneLabel: (sceneShortId: string, label: string) => void;
  removeScene: (sceneId: string) => Promise<void>;
  loadEntities: () => Promise<void>;
  loadThreadCount: () => Promise<void>;
  loadStoryboardComments: () => Promise<void>;
  refreshAll: () => Promise<void>;
  createComment: (
    payload: CreateStoryboardCommentPayload
  ) => Promise<StoryboardCommentData>;
  updateComment: (
    commentId: string,
    payload: { body: string }
  ) => Promise<StoryboardCommentData>;
  deleteComment: (commentId: string) => Promise<void>;
  resolveComment: (commentId: string) => Promise<StoryboardCommentData>;
  reopenComment: (commentId: string) => Promise<StoryboardCommentData>;
  saveStory: (payload: StorySavePayload) => Promise<void>;
  saveScene: (sceneId: string, payload: SceneSavePayload) => Promise<void>;
  scheduleAutosave: (
    key: string,
    action: () => Promise<void>,
    delayMs?: number
  ) => void;
  flushAutosave: (key: string) => Promise<void>;
  cancelAutosave: (key: string) => void;
  triggerReanalyze: () => Promise<void>;
}

export interface StoryProviderProps {
  storyId: string;
  children: React.ReactNode;
}

const StoryContext = createContext<StoryContextType | null>(null);

const getAutosaveKey = (scope: "story" | "scene", id?: string) => {
  if (scope === "story") {
    return "story";
  }

  return `scene:${id ?? "unknown"}`;
};

const parseError = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(fallback);
};

export const StoryProvider = ({ children, storyId }: StoryProviderProps) => {
  const [story, setStory] = useState<StoryData | null>(null);
  const [apiScenes, setApiScenes] = useState<ApiScene[]>([]);
  const [mentions, setMentions] = useState<StoryMention[]>([]);
  const [storyboardComments, setStoryboardComments] = useState<
    StoryboardCommentData[]
  >([]);
  const [threadTotal, setThreadTotal] = useState(0);
  const [queueMessage, setQueueMessage] = useState<string | null>(null);
  const [lastAnalysisDiagnostic, setLastAnalysisDiagnostic] = useState<
    string | null
  >(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saveStatusByKey, setSaveStatusByKey] = useState<
    Record<string, SaveStatusRecord>
  >({});
  const [lastSavedAtByKey, setLastSavedAtByKey] = useState<
    Record<string, number | null>
  >({});
  const [sceneOrganizerValue, setSceneOrganizerValue] =
    useState<SceneOrganizerValue>({ rows: [] });
  const [mentionOrganizerValue, setMentionOrganizerValue] =
    useState<MentionOrganizerValue>(EMPTY_MENTION_ORGANIZER_VALUE);

  const autosaveTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  const autosaveActionsRef = useRef<Map<string, () => Promise<void>>>(
    new Map()
  );
  const savingSceneIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedOrganizerRef = useRef(false);
  const hasInitializedMentionOrganizerRef = useRef(false);

  const setSaveStatus = useCallback((key: string, next: SaveStatusRecord) => {
    setSaveStatusByKey((current) => ({
      ...current,
      [key]: next,
    }));
  }, []);

  const refetchStory = useCallback(async () => {
    if (!storyId) {
      return null;
    }

    try {
      const data = await getStory(storyId);
      setStory(data);
      setError(null);
      return data;
    } catch (caughtError) {
      const typedError = parseError(caughtError, "Failed to fetch story");
      setError(typedError);
      return null;
    }
  }, [storyId]);

  const loadScenes = useCallback(async () => {
    if (!storyId) {
      return;
    }

    try {
      const data = await getScenes(storyId);
      console.log(data);
      setApiScenes(Array.isArray(data) ? data : []);
    } catch {
      setApiScenes([]);
    }
  }, [storyId]);

  const addScene = useCallback(
    async (payload: CreateScenePayload = {}) => {
      if (!storyId) {
        throw new Error("Missing story id");
      }

      const created = await createScene(storyId, payload);
      await loadScenes();
      return created;
    },
    [loadScenes, storyId]
  );

  const loadEntities = useCallback(async () => {
    if (!storyId) {
      return;
    }

    try {
      const rows = await getMentions(storyId, { status: "confirmed" });
      setMentions(
        Array.isArray(rows)
          ? rows.map((row) => mapApiMentionToStoryMention(row as ApiMention))
          : []
      );
    } catch {
      setMentions([]);
    }
  }, [storyId]);

  const loadThreadCount = useCallback(async () => {
    if (!storyId) {
      return;
    }

    try {
      const data = await getIntelligenceThreads(storyId);
      setThreadTotal(Array.isArray(data) ? data.length : 0);
    } catch {
      setThreadTotal(0);
    }
  }, [storyId]);

  const loadStoryboardComments = useCallback(async () => {
    if (!storyId) {
      return;
    }

    try {
      const data = await getStoryboardComments(storyId);
      setStoryboardComments(Array.isArray(data) ? data : []);
    } catch {
      setStoryboardComments([]);
    }
  }, [storyId]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refetchStory(),
      loadScenes(),
      loadEntities(),
      loadThreadCount(),
      loadStoryboardComments(),
    ]);
  }, [
    loadEntities,
    loadScenes,
    loadStoryboardComments,
    loadThreadCount,
    refetchStory,
  ]);

  const createComment = useCallback(
    async (payload: CreateStoryboardCommentPayload) => {
      if (!storyId) {
        throw new Error("Missing story id");
      }

      const created = await createStoryboardComment(storyId, payload);
      await loadStoryboardComments();
      return created;
    },
    [loadStoryboardComments, storyId]
  );

  const updateComment = useCallback(
    async (commentId: string, payload: { body: string }) => {
      if (!storyId) {
        throw new Error("Missing story id");
      }

      const updated = await patchStoryboardComment(storyId, commentId, payload);
      await loadStoryboardComments();
      return updated;
    },
    [loadStoryboardComments, storyId]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!storyId) {
        throw new Error("Missing story id");
      }

      await deleteStoryboardComment(storyId, commentId);
      await loadStoryboardComments();
    },
    [loadStoryboardComments, storyId]
  );

  const resolveComment = useCallback(
    async (commentId: string) => {
      if (!storyId) {
        throw new Error("Missing story id");
      }

      const resolved = await resolveStoryboardComment(storyId, commentId);
      await loadStoryboardComments();
      return resolved;
    },
    [loadStoryboardComments, storyId]
  );

  const reopenComment = useCallback(
    async (commentId: string) => {
      if (!storyId) {
        throw new Error("Missing story id");
      }

      const reopened = await reopenStoryboardComment(storyId, commentId);
      await loadStoryboardComments();
      return reopened;
    },
    [loadStoryboardComments, storyId]
  );

  const saveStory = useCallback(
    async (payload: StorySavePayload) => {
      if (!storyId) {
        return;
      }

      const key = getAutosaveKey("story");
      setSaveStatus(key, { state: "saving", error: null });

      try {
        await patchStory(storyId, payload);
        setSaveStatus(key, { state: "saved", error: null });
        setLastSavedAtByKey((current) => ({
          ...current,
          [key]: Date.now(),
        }));
        await Promise.all([refetchStory(), loadScenes()]);
      } catch (caughtError) {
        const typedError = parseError(caughtError, "Failed to save story");
        setSaveStatus(key, {
          state: "error",
          error: typedError.message,
        });
        throw typedError;
      }
    },
    [loadScenes, refetchStory, setSaveStatus, storyId]
  );

  const saveScene = useCallback(
    async (sceneId: string, payload: SceneSavePayload) => {
      if (!storyId) {
        return;
      }

      const key = getAutosaveKey("scene", sceneId);
      setSaveStatus(key, { state: "saving", error: null });
      savingSceneIdsRef.current.add(sceneId);

      try {
        await patchSceneContent(storyId, sceneId, payload);
        setSaveStatus(key, { state: "saved", error: null });
        setLastSavedAtByKey((current) => ({
          ...current,
          [key]: Date.now(),
        }));
        await loadScenes();
        await refetchStory();
      } catch (caughtError) {
        const typedError = parseError(caughtError, "Failed to save scene");
        setSaveStatus(key, {
          state: "error",
          error: typedError.message,
        });
        throw typedError;
      } finally {
        savingSceneIdsRef.current.delete(sceneId);
      }
    },
    [loadScenes, refetchStory, setSaveStatus, storyId]
  );

  const cancelAutosave = useCallback((key: string) => {
    const timer = autosaveTimersRef.current.get(key);
    if (timer) {
      clearTimeout(timer);
      autosaveTimersRef.current.delete(key);
    }

    autosaveActionsRef.current.delete(key);
  }, []);

  const flushAutosave = useCallback(
    async (key: string) => {
      const action = autosaveActionsRef.current.get(key);
      cancelAutosave(key);

      if (!action) {
        return;
      }

      await action();
    },
    [cancelAutosave]
  );

  const scheduleAutosave = useCallback(
    (key: string, action: () => Promise<void>, delayMs = 3000) => {
      cancelAutosave(key);
      autosaveActionsRef.current.set(key, action);

      const timer = setTimeout(() => {
        void flushAutosave(key);
      }, delayMs);

      autosaveTimersRef.current.set(key, timer);
    },
    [cancelAutosave, flushAutosave]
  );

  const triggerReanalyze = useCallback(async () => {
    if (!storyId) {
      return;
    }

    setQueueMessage(null);

    try {
      const currentScenes = await getScenes(storyId);
      if (currentScenes.length === 0) {
        setQueueMessage("No scenes were generated from the current story.");
        return;
      }

      const queued = await Promise.all(
        currentScenes.map((scene) =>
          analyzeSceneIntelligence(storyId, scene.id)
        )
      );

      if (queued.some((job) => job.queued)) {
        setQueueMessage(
          `Queued ${queued.length} scene${
            queued.length === 1 ? "" : "s"
          } for analysis.`
        );
        await loadThreadCount();
      }
    } catch (caughtError) {
      const typedError = parseError(
        caughtError,
        "Failed to run full re-analyze"
      );
      setQueueMessage(typedError.message);
    }
  }, [loadThreadCount, storyId]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await refreshAll();
      } finally {
        setIsLoading(false);
      }
    };

    if (storyId) {
      void load();
    }
  }, [refreshAll, storyId]);

  useEffect(() => {
    if (!storyId) {
      return;
    }

    const diagnosticMap: Record<string, string> = {
      empty_extraction: "no extractable content",
      analyzer_returned_empty: "analyzer returned no thread payloads",
      threads_filtered_by_confidence: "thread candidates filtered by confidence",
      duplicate_content: "content unchanged since last analysis",
      analyzer_failed: "analysis failed",
    };

    const intelligenceSocket = connectIntelligenceSocket(storyId, {
      onAnalysisComplete: async (event) => {
        const totalThreads = event.threadsCreated + event.threadsUpdated;
        const diagnosticLabel = event.diagnostic
          ? (diagnosticMap[event.diagnostic] ?? event.diagnostic)
          : "analysis complete";

        setQueueMessage(
          `Analysis complete: ${totalThreads} thread${totalThreads === 1 ? "" : "s"} updated`
        );

        const sceneLabel = event.sceneId
          ? apiScenes.find((scene) => scene.id === event.sceneId)?.label ??
            event.sceneId.slice(-6)
          : "story";

        setLastAnalysisDiagnostic(`Scene "${sceneLabel}": ${diagnosticLabel}`);

        await Promise.all([loadEntities(), loadThreadCount()]);
      },
      onError: (message) => {
        setQueueMessage(`Intelligence realtime disconnected: ${message}`);
      },
      onStatusChange: (state) => {
        setConnectionState(state);
        if (state === "connected") {
          setQueueMessage(null);
        }
      },
    });

    const progressSocket: Socket | null = connectProgressSocket(storyId, {
      onStoryboardCommentCreated: () => {
        void loadStoryboardComments();
      },
      onStoryboardCommentUpdated: () => {
        void loadStoryboardComments();
      },
      onStoryboardCommentDeleted: () => {
        void loadStoryboardComments();
      },
      onStoryboardCommentResolved: () => {
        void loadStoryboardComments();
      },
      onStoryboardCommentReopened: () => {
        void loadStoryboardComments();
      },
      onSceneContentUpdated: (event) => {
        if (savingSceneIdsRef.current.has(event.sceneId)) {
          return;
        }

        void loadScenes();
      },
    });

    return () => {
      intelligenceSocket?.disconnect();
      progressSocket?.disconnect();
    };
  }, [
    apiScenes,
    loadEntities,
    loadScenes,
    loadStoryboardComments,
    loadThreadCount,
    storyId,
  ]);

  useEffect(() => {
    return () => {
      for (const timer of autosaveTimersRef.current.values()) {
        clearTimeout(timer);
      }

      autosaveTimersRef.current.clear();
      autosaveActionsRef.current.clear();
    };
  }, []);

  const isReadOnly = useMemo(() => {
    const status = story?.subscriptionStatus;
    return status === "canceled" || status === "past_due";
  }, [story?.subscriptionStatus]);

  const scenes = useMemo(
    () => mapApiScenesToStudioScenes(apiScenes),
    [apiScenes]
  );

  const editorScenes = useMemo(
    () => mapApiScenesToStoryScenes(apiScenes),
    [apiScenes]
  );

  const orderedEditorScenes = useMemo(
    () => sortScenesByOrganizerOrder(editorScenes, sceneOrganizerValue),
    [editorScenes, sceneOrganizerValue]
  );

  useEffect(() => {
    void storyId;
    hasInitializedOrganizerRef.current = false;
    hasInitializedMentionOrganizerRef.current = false;
  }, [storyId]);

  useEffect(() => {
    if (!story || hasInitializedOrganizerRef.current) {
      return;
    }

    const savedOrganizer = parseSceneOrganizerValue(story.metadata);
    if (savedOrganizer) {
      setSceneOrganizerValue(savedOrganizer);
      hasInitializedOrganizerRef.current = true;
      return;
    }

    if (editorScenes.length === 0) {
      return;
    }

    setSceneOrganizerValue(scenesToInitialValue(editorScenes));
    hasInitializedOrganizerRef.current = true;
  }, [editorScenes, story]);

  useEffect(() => {
    if (!story || hasInitializedMentionOrganizerRef.current) {
      return;
    }

    const savedOrganizer = parseMentionOrganizerValue(story.metadata);
    setMentionOrganizerValue(savedOrganizer ?? EMPTY_MENTION_ORGANIZER_VALUE);
    hasInitializedMentionOrganizerRef.current = true;
  }, [story]);

  const createSceneForOrganizer = useCallback(
    async (draft: Partial<StoryScene>) => {
      if (isReadOnly || !storyId) {
        return undefined;
      }

      const created = await createScene(storyId, {
        title: draft.label ?? "Untitled Scene",
        order: draft.order,
        visible: true,
        color: draft.color,
      });

      setApiScenes((current) => {
        if (current.some((scene) => scene.id === created.id)) {
          return current;
        }

        return [...current, created];
      });

      void loadScenes();

      return mapApiSceneToStoryScene(created);
    },
    [isReadOnly, loadScenes, storyId]
  );

  const saveSceneOrganizer = useCallback(
    async (value: SceneOrganizerValue) => {
      if (!storyId || isReadOnly) {
        return;
      }

      const metadata = buildStoryMetadata(story?.metadata, value);
      await patchStoryMetadata(storyId, metadata);

      setStory((current) =>
        current ? { ...current, metadata } : current
      );

      const shortIds = flattenSceneOrganizerOrder(value);
      await Promise.all(
        shortIds.map(async (shortId, index) => {
          const scene = apiScenes.find((entry) => entry.shortId === shortId);
          if (!scene) {
            return;
          }

          const nextOrder = index + 1;
          if (scene.order === nextOrder) {
            return;
          }

          await patchScene(storyId, scene.id, { order: nextOrder });
        })
      );

      await loadScenes();
    },
    [apiScenes, isReadOnly, loadScenes, story?.metadata, storyId]
  );

  const handleSceneOrganizerChange = useCallback(
    (value: SceneOrganizerValue) => {
      setSceneOrganizerValue(value);

      if (isReadOnly) {
        return;
      }

      scheduleAutosave(
        "scene-organizer",
        async () => {
          await saveSceneOrganizer(value);
        },
        500
      );
    },
    [isReadOnly, saveSceneOrganizer, scheduleAutosave]
  );

  const saveMentionOrganizer = useCallback(
    async (value: MentionOrganizerValue) => {
      if (!storyId || isReadOnly) {
        return;
      }

      const metadata = buildMentionOrganizerMetadata(story?.metadata, value);
      await patchStoryMetadata(storyId, metadata);

      setStory((current) =>
        current ? { ...current, metadata } : current
      );
    },
    [isReadOnly, story?.metadata, storyId]
  );

  const handleMentionOrganizerChange = useCallback(
    (value: MentionOrganizerValue) => {
      setMentionOrganizerValue(value);

      if (isReadOnly) {
        return;
      }

      scheduleAutosave(
        "mention-organizer",
        async () => {
          await saveMentionOrganizer(value);
        },
        500
      );
    },
    [isReadOnly, saveMentionOrganizer, scheduleAutosave]
  );

  const createMentionForOrganizer = useCallback(
    async (draft: Partial<StoryMention>) => {
      if (isReadOnly || !storyId || !draft.label || !draft.type) {
        return;
      }

      const created = await createMention(
        storyId,
        mapStoryMentionToCreatePayload(draft)
      );
      const mapped = mapApiMentionToStoryMention(created as ApiMention);
      setMentions((current) => [...current, mapped]);
    },
    [isReadOnly, storyId]
  );

  const createGroupForOrganizer = useCallback(
    async (draft: Omit<StoryMention, "id">): Promise<StoryMention | undefined> => {
      if (isReadOnly || !storyId) {
        return undefined;
      }

      const created = await createMention(
        storyId,
        mapStoryMentionToCreatePayload({
          label: draft.label,
          type: "group",
          color: draft.color,
        })
      );
      const mapped = mapApiMentionToStoryMention(created as ApiMention);
      setMentions((current) => [...current, mapped]);
      return mapped;
    },
    [isReadOnly, storyId]
  );

  const removeGroupFromOrganizer = useCallback(
    async (groupId: string) => {
      if (isReadOnly || !storyId) {
        return;
      }

      await deleteMention(groupId);
      setMentions((current) => current.filter((mention) => mention.id !== groupId));
    },
    [isReadOnly, storyId]
  );

  const registerSceneInOrganizer = useCallback(
    (sceneShortId: string) => {
      if (flattenSceneOrganizerOrder(sceneOrganizerValue).includes(sceneShortId)) {
        return;
      }

      handleSceneOrganizerChange(
        appendSceneRow(sceneOrganizerValue, sceneShortId)
      );
    },
    [handleSceneOrganizerChange, sceneOrganizerValue]
  );

  const updateSceneLabel = useCallback(
    (sceneShortId: string, label: string) => {
      if (!storyId || isReadOnly) {
        return;
      }

      const trimmedLabel = label.trim() || "Untitled Scene";
      const scene = apiScenes.find((entry) => entry.shortId === sceneShortId);
      if (!scene) {
        return;
      }

      const currentLabel = scene.label ?? "Untitled Scene";
      if (currentLabel === trimmedLabel) {
        return;
      }

      setApiScenes((current) =>
        current.map((entry) =>
          entry.shortId === sceneShortId ? { ...entry, label: trimmedLabel } : entry
        )
      );

      scheduleAutosave(
        `scene-title:${sceneShortId}`,
        async () => {
          await updateSceneTitle(storyId, scene.id, trimmedLabel);
          await loadScenes();
        },
        500
      );
    },
    [apiScenes, isReadOnly, loadScenes, scheduleAutosave, storyId]
  );

  const removeScene = useCallback(
    async (sceneId: string) => {
      if (!storyId || isReadOnly) {
        return;
      }

      const scene = apiScenes.find((entry) => entry.id === sceneId);
      if (!scene) {
        return;
      }

      cancelAutosave(getAutosaveKey("scene", sceneId));
      cancelAutosave(`scene-title:${scene.shortId}`);
      cancelAutosave("scene-organizer");

      await deleteScene(storyId, sceneId);

      setApiScenes((current) => current.filter((entry) => entry.id !== sceneId));

      const nextOrganizer = removeSceneFromOrganizer(
        sceneOrganizerValue,
        scene.shortId
      );
      setSceneOrganizerValue(nextOrganizer);
      await saveSceneOrganizer(nextOrganizer);
      await refetchStory();
    },
    [
      apiScenes,
      cancelAutosave,
      isReadOnly,
      refetchStory,
      saveSceneOrganizer,
      sceneOrganizerValue,
      storyId,
    ]
  );

  const value = useMemo<StoryContextType>(
    () => ({
      storyId,
      story,
      scenes,
      editorScenes,
      orderedEditorScenes,
      sceneOrganizerValue,
      mentionOrganizerValue,
      mentions,
      storyboardComments,
      threadTotal,
      queueMessage,
      lastAnalysisDiagnostic,
      connectionState,
      isLoading,
      error,
      isReadOnly,
      saveStatusByKey,
      lastSavedAtByKey,
      refetchStory,
      loadScenes,
      addScene,
      createSceneForOrganizer,
      handleSceneOrganizerChange,
      handleMentionOrganizerChange,
      createMentionForOrganizer,
      createGroupForOrganizer,
      removeGroupFromOrganizer,
      registerSceneInOrganizer,
      updateSceneLabel,
      removeScene,
      loadEntities,
      loadThreadCount,
      loadStoryboardComments,
      refreshAll,
      createComment,
      updateComment,
      deleteComment,
      resolveComment,
      reopenComment,
      saveStory,
      saveScene,
      scheduleAutosave,
      flushAutosave,
      cancelAutosave,
      triggerReanalyze,
    }),
    [
      cancelAutosave,
      connectionState,
      createSceneForOrganizer,
      createGroupForOrganizer,
      createMentionForOrganizer,
      editorScenes,
      error,
      flushAutosave,
      handleMentionOrganizerChange,
      handleSceneOrganizerChange,
      registerSceneInOrganizer,
      isLoading,
      isReadOnly,
      lastAnalysisDiagnostic,
      lastSavedAtByKey,
      loadEntities,
      loadScenes,
      addScene,
      loadStoryboardComments,
      loadThreadCount,
      mentionOrganizerValue,
      mentions,
      orderedEditorScenes,
      sceneOrganizerValue,
      storyboardComments,
      scenes,
      queueMessage,
      refetchStory,
      refreshAll,
      createComment,
      updateComment,
      deleteComment,
      resolveComment,
      reopenComment,
      saveScene,
      saveStatusByKey,
      saveStory,
      scheduleAutosave,
      story,
      storyId,
      threadTotal,
      triggerReanalyze,
      updateSceneLabel,
      removeGroupFromOrganizer,
      removeScene,
    ]
  );

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }

  return context;
};
