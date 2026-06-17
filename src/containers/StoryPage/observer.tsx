"use client";

import type { Editor } from "@tiptap/react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MentionType = "person" | "place" | "thing";
type ObserverEntityType = "scene" | "mention";
type ObserverItemSource = "section" | "reference";
type ObserverRefType = "mention";

export interface VisibleObserverItem {
  id: string;
  type: ObserverEntityType;
  source: ObserverItemSource;
  sceneId?: string;
  mentionType?: MentionType;
}

interface ObserverSnapshot {
  visibleSceneIds: string[];
  visibleMentionIds: string[];
  visibleItems: VisibleObserverItem[];
}

interface RefElementMeta {
  id: string;
  type: ObserverRefType;
  mentionType: MentionType;
  sceneId: string;
  order: number;
}

interface EditorBinding {
  editor: Editor;
  handleUpdate: () => void;
}

export interface ObserverContextType extends ObserverSnapshot {
  registerSceneSection: (sceneId: string, node: HTMLElement | null) => void;
  registerEditor: (sceneId: string, editor: Editor | null) => void;
}

export interface ObserverProviderProps extends PropsWithChildren {}

const SCROLL_IDLE_MS = 140;
const SNAPSHOT_DEBOUNCE_MS = 80;

const EMPTY_SNAPSHOT: ObserverSnapshot = {
  visibleSceneIds: [],
  visibleMentionIds: [],
  visibleItems: [],
};

const ObserverContext = createContext<ObserverContextType | null>(null);

const arraysEqual = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
};

const itemsEqual = (
  left: VisibleObserverItem[],
  right: VisibleObserverItem[]
) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (
      left[index]?.id !== right[index]?.id ||
      left[index]?.type !== right[index]?.type ||
      left[index]?.source !== right[index]?.source ||
      left[index]?.sceneId !== right[index]?.sceneId
    ) {
      return false;
    }
  }

  return true;
};

const snapshotEqual = (left: ObserverSnapshot, right: ObserverSnapshot) => {
  return (
    arraysEqual(left.visibleSceneIds, right.visibleSceneIds) &&
    arraysEqual(left.visibleMentionIds, right.visibleMentionIds) &&
    itemsEqual(left.visibleItems, right.visibleItems)
  );
};

const normalizeMentionType = (
  value: string | null | undefined
): MentionType | null => {
  if (value === "person" || value === "place" || value === "thing") {
    return value;
  }

  if (value === "character") {
    return "person";
  }

  if (value === "location") {
    return "place";
  }

  return null;
};

const getSceneOrder = (sceneOrders: Map<string, number>, sceneId: string) => {
  return sceneOrders.get(sceneId) ?? Number.MAX_SAFE_INTEGER;
};

export const ObserverProvider = ({ children }: ObserverProviderProps) => {
  const [snapshot, setSnapshot] = useState<ObserverSnapshot>(EMPTY_SNAPSHOT);
  const sceneElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const sceneOrdersRef = useRef<Map<string, number>>(new Map());
  const sceneEditorsRef = useRef<Map<string, EditorBinding>>(new Map());
  const sceneRefElementsRef = useRef<Map<string, Set<HTMLElement>>>(new Map());
  const refElementMetaRef = useRef<Map<HTMLElement, RefElementMeta>>(new Map());
  const visibleSceneIdsRef = useRef<Set<string>>(new Set());
  const visibleRefElementsRef = useRef<Set<HTMLElement>>(new Set());
  const sceneObserverRef = useRef<IntersectionObserver | null>(null);
  const refObserverRef = useRef<IntersectionObserver | null>(null);
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  const hasPublishedInitialSnapshotRef = useRef(false);

  const publishSnapshot = useCallback(() => {
    const visibleSceneIds = [...visibleSceneIdsRef.current].sort(
      (left, right) => {
        return (
          getSceneOrder(sceneOrdersRef.current, left) -
          getSceneOrder(sceneOrdersRef.current, right)
        );
      }
    );

    const visibleMentionIds: string[] = [];
    const visibleMentionIdSet = new Set<string>();

    const sortedVisibleRefs = [...visibleRefElementsRef.current]
      .map((element) => ({
        element,
        meta: refElementMetaRef.current.get(element),
      }))
      .filter(
        (entry): entry is { element: HTMLElement; meta: RefElementMeta } => {
          if (!entry.meta) {
            return false;
          }

          return visibleSceneIdsRef.current.has(entry.meta.sceneId);
        }
      )
      .sort((left, right) => {
        const sceneOrderDiff =
          getSceneOrder(sceneOrdersRef.current, left.meta.sceneId) -
          getSceneOrder(sceneOrdersRef.current, right.meta.sceneId);

        if (sceneOrderDiff !== 0) {
          return sceneOrderDiff;
        }

        if (left.meta.order !== right.meta.order) {
          return left.meta.order - right.meta.order;
        }

        if (left.element === right.element) {
          return 0;
        }

        return left.element.compareDocumentPosition(right.element) &
          Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1;
      });

    const visibleItems: VisibleObserverItem[] = visibleSceneIds.map(
      (sceneId) => ({
        id: sceneId,
        type: "scene",
        source: "section",
        sceneId,
      })
    );

    for (const { meta } of sortedVisibleRefs) {
      if (visibleMentionIdSet.has(meta.id)) {
        continue;
      }

      visibleMentionIdSet.add(meta.id);
      visibleMentionIds.push(meta.id);

      visibleItems.push({
        id: meta.id,
        type: "mention",
        source: "reference",
        sceneId: meta.sceneId,
        mentionType: meta.mentionType,
      });
    }

    const nextSnapshot: ObserverSnapshot = {
      visibleSceneIds,
      visibleMentionIds,
      visibleItems,
    };

    setSnapshot((current) => {
      if (snapshotEqual(current, nextSnapshot)) {
        return current;
      }

      hasPublishedInitialSnapshotRef.current = true;

      return nextSnapshot;
    });
  }, []);

  const clearPendingSnapshot = useCallback(() => {
    if (snapshotTimerRef.current) {
      clearTimeout(snapshotTimerRef.current);
      snapshotTimerRef.current = null;
    }
  }, []);

  const scheduleSnapshotUpdate = useCallback(
    (options?: { immediate?: boolean }) => {
      const immediate = options?.immediate ?? false;

      clearPendingSnapshot();

      if (immediate || !hasPublishedInitialSnapshotRef.current) {
        publishSnapshot();
        return;
      }

      if (isScrollingRef.current) {
        return;
      }

      snapshotTimerRef.current = setTimeout(() => {
        snapshotTimerRef.current = null;
        publishSnapshot();
      }, SNAPSHOT_DEBOUNCE_MS);
    },
    [clearPendingSnapshot, publishSnapshot]
  );

  const clearSceneRefs = useCallback(
    (sceneId: string) => {
      const currentRefs = sceneRefElementsRef.current.get(sceneId);
      if (!currentRefs) {
        return;
      }

      for (const element of currentRefs) {
        refObserverRef.current?.unobserve(element);
        refElementMetaRef.current.delete(element);
        visibleRefElementsRef.current.delete(element);
      }

      sceneRefElementsRef.current.delete(sceneId);
      scheduleSnapshotUpdate();
    },
    [scheduleSnapshotUpdate]
  );

  const rescanSceneRefs = useCallback(
    (sceneId: string) => {
      const binding = sceneEditorsRef.current.get(sceneId);
      const editorRoot = binding?.editor?.view?.dom;

      if (!(editorRoot instanceof HTMLElement)) {
        clearSceneRefs(sceneId);
        return;
      }

      const nextRefs = new Set<HTMLElement>();
      const discoveredElements = Array.from(
        editorRoot.querySelectorAll<HTMLElement>("[data-ref-type][data-ref-id]")
      );

      discoveredElements.forEach((element, index) => {
        const mentionType = normalizeMentionType(element.dataset.refType);
        const id = element.dataset.refId;
        if (!id || !mentionType) {
          return;
        }

        nextRefs.add(element);
        refElementMetaRef.current.set(element, {
          id,
          type: "mention",
          mentionType,
          sceneId,
          order: index,
        });
      });

      const previousRefs =
        sceneRefElementsRef.current.get(sceneId) ?? new Set();

      for (const element of previousRefs) {
        if (nextRefs.has(element)) {
          continue;
        }

        refObserverRef.current?.unobserve(element);
        refElementMetaRef.current.delete(element);
        visibleRefElementsRef.current.delete(element);
      }

      for (const element of nextRefs) {
        if (!previousRefs.has(element)) {
          refObserverRef.current?.observe(element);
        }
      }

      sceneRefElementsRef.current.set(sceneId, nextRefs);
      scheduleSnapshotUpdate();
    },
    [clearSceneRefs, scheduleSnapshotUpdate]
  );

  const registerSceneSection = useCallback(
    (sceneId: string, node: HTMLElement | null) => {
      const currentNode = sceneElementsRef.current.get(sceneId);

      if (currentNode && currentNode !== node) {
        sceneObserverRef.current?.unobserve(currentNode);
      }

      if (!node) {
        sceneElementsRef.current.delete(sceneId);
        sceneOrdersRef.current.delete(sceneId);
        visibleSceneIdsRef.current.delete(sceneId);
        scheduleSnapshotUpdate();
        return;
      }

      sceneElementsRef.current.set(sceneId, node);
      sceneOrdersRef.current.set(
        sceneId,
        Number(node.dataset.sceneOrder ?? Number.MAX_SAFE_INTEGER)
      );
      sceneObserverRef.current?.observe(node);
      scheduleSnapshotUpdate();
    },
    [scheduleSnapshotUpdate]
  );

  const registerEditor = useCallback(
    (sceneId: string, editor: Editor | null) => {
      const existingBinding = sceneEditorsRef.current.get(sceneId);
      if (existingBinding) {
        existingBinding.editor.off("update", existingBinding.handleUpdate);
        sceneEditorsRef.current.delete(sceneId);
      }

      if (!editor) {
        clearSceneRefs(sceneId);
        return;
      }

      const handleUpdate = () => {
        rescanSceneRefs(sceneId);
      };

      sceneEditorsRef.current.set(sceneId, { editor, handleUpdate });
      editor.on("update", handleUpdate);
      rescanSceneRefs(sceneId);
    },
    [clearSceneRefs, rescanSceneRefs]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    sceneObserverRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target;
          if (!(target instanceof HTMLElement)) {
            continue;
          }

          const sceneId = target.dataset.sceneId;
          if (!sceneId) {
            continue;
          }

          if (entry.isIntersecting) {
            visibleSceneIdsRef.current.add(sceneId);
          } else {
            visibleSceneIdsRef.current.delete(sceneId);
          }
        }

        scheduleSnapshotUpdate({
          immediate: !hasPublishedInitialSnapshotRef.current,
        });
      },
      {
        root: null,
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    refObserverRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const target = entry.target;
          if (!(target instanceof HTMLElement)) {
            continue;
          }

          if (entry.isIntersecting) {
            visibleRefElementsRef.current.add(target);
          } else {
            visibleRefElementsRef.current.delete(target);
          }
        }

        scheduleSnapshotUpdate({
          immediate: !hasPublishedInitialSnapshotRef.current,
        });
      },
      {
        root: null,
        threshold: [0, 0.2, 0.5, 0.8],
      }
    );

    for (const node of sceneElementsRef.current.values()) {
      sceneObserverRef.current.observe(node);
    }

    for (const refs of sceneRefElementsRef.current.values()) {
      for (const element of refs) {
        refObserverRef.current.observe(element);
      }
    }

    const handleScroll = () => {
      isScrollingRef.current = true;
      clearPendingSnapshot();

      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }

      scrollIdleTimerRef.current = setTimeout(() => {
        scrollIdleTimerRef.current = null;
        isScrollingRef.current = false;
        scheduleSnapshotUpdate({ immediate: true });
      }, SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearPendingSnapshot();
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
        scrollIdleTimerRef.current = null;
      }
      sceneObserverRef.current?.disconnect();
      refObserverRef.current?.disconnect();
      sceneObserverRef.current = null;
      refObserverRef.current = null;
      isScrollingRef.current = false;
      hasPublishedInitialSnapshotRef.current = false;
      visibleSceneIdsRef.current.clear();
      visibleRefElementsRef.current.clear();
      setSnapshot(EMPTY_SNAPSHOT);
    };
  }, [clearPendingSnapshot, scheduleSnapshotUpdate]);

  useEffect(() => {
    return () => {
      for (const [sceneId, binding] of sceneEditorsRef.current.entries()) {
        binding.editor.off("update", binding.handleUpdate);
        sceneEditorsRef.current.delete(sceneId);
      }
    };
  }, []);

  const value = useMemo<ObserverContextType>(() => {
    return {
      ...snapshot,
      registerSceneSection,
      registerEditor,
    };
  }, [registerEditor, registerSceneSection, snapshot]);

  return (
    <ObserverContext.Provider value={value}>
      {children}
    </ObserverContext.Provider>
  );
};

export const useObserver = () => {
  const context = useContext(ObserverContext);
  if (!context) {
    throw new Error("useObserver must be used within an ObserverProvider");
  }

  return context;
};
