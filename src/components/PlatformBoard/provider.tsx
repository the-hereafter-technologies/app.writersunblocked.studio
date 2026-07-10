"use client";

import { useStory } from "@/containers/StoryPage";
import {
  applyPlatformItem,
  createPlatformPost,
  getPlatformPosts,
  rejectPlatformItem,
  type PlatformItemData,
  type PlatformPostData,
  type PlatformSocketEventData,
} from "@/services/api/platform";
import { connectStoryboardSocket } from "@/services/sockets/storyboard.socket";
import {
  PlatformAction,
  type PlatformPostField,
  type PlatformPostItemProps,
} from "@writersunblocked/ui/app";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  isActionableItem,
  mapApiPostToUiPost,
  pickDefaultPostId,
  PlatformBoardContext,
} from "./utils";

const toPlatformAction = (action: string): PlatformAction => {
  switch (action) {
    case PlatformAction.NEW_MENTION:
    case PlatformAction.UPDATE_MENTION:
    case PlatformAction.NEW_SCENE:
    case PlatformAction.UPDATE_SCENE:
    case PlatformAction.NEW_NOTE:
    case PlatformAction.UPDATE_NOTE:
      return action;
    default:
      return PlatformAction.NEW_NOTE;
  }
};

const mapItemToPostItemProps = (
  item: PlatformItemData
): PlatformPostItemProps & { id: string } => ({
  id: item.id,
  action: toPlatformAction(item.action ?? PlatformAction.NEW_NOTE),
  body: item.body ?? "",
  data: (item.data ?? []).map((field) => ({
    label: field.label,
    type: field.type as PlatformPostField["type"],
    value: field.value,
  })),
  accepted: item.status === "APPROVED",
});

const mergePosts = (
  current: PlatformPostData[],
  incoming: PlatformPostData[]
): PlatformPostData[] => {
  const byId = new Map(current.map((post) => [post.id, post]));

  for (const post of incoming) {
    const existing = byId.get(post.id);
    if (!existing) {
      byId.set(post.id, post);
      continue;
    }

    const itemsById = new Map(existing.items.map((item) => [item.id, item]));
    for (const item of post.items) {
      itemsById.set(item.id, item);
    }

    byId.set(post.id, {
      ...existing,
      ...post,
      items: Array.from(itemsById.values()),
    });
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const mergeSocketItems = (
  posts: PlatformPostData[],
  postId: string,
  items: PlatformItemData[]
): PlatformPostData[] => {
  return posts.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    const itemsById = new Map(post.items.map((item) => [item.id, item]));
    for (const item of items) {
      itemsById.set(item.id, item);
    }

    return {
      ...post,
      items: Array.from(itemsById.values()),
    };
  });
};

type PlatformBoardProviderProps = PropsWithChildren<{
  storyId: string;
}>;

export const PlatformBoardProvider = ({
  storyId,
  children,
}: PlatformBoardProviderProps) => {
  const { refreshAll, registerSceneInOrganizer } = useStory();
  const [postsData, setPostsData] = useState<PlatformPostData[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postsLoading, setPostsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyzingPostId, setAnalyzingPostId] = useState<string | null>(null);
  const [applyingItemId, setApplyingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!storyId?.trim()) {
      return;
    }

    setPostsLoading(true);
    setError(null);

    try {
      const posts = await getPlatformPosts(storyId);
      setPostsData(posts);
      setSelectedPostId((current) => current ?? pickDefaultPostId(posts));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load platform posts."
      );
    } finally {
      setPostsLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (!storyId?.trim()) {
      return;
    }

    const socket = connectStoryboardSocket(storyId, {
      onPlatformSuccess: (event: { storyId: string; data: PlatformSocketEventData }) => {
        const { postId, items } = event.data;
        if (!postId) {
          return;
        }

        setAnalyzingPostId(null);
        setSelectedPostId(postId);

        if (!items?.length) {
          return;
        }

        setPostsData((current) => mergeSocketItems(current, postId, items));
      },
    });

    return () => {
      socket?.disconnect();
    };
  }, [storyId]);

  const selectPost = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setActionError(null);
  }, []);

  const submitPost = useCallback(
    async (payload: {
      platformType: string;
      body: string;
      content?: unknown;
      color?: string;
    }) => {
      if (!storyId?.trim()) {
        return false;
      }

      setSubmitting(true);
      setError(null);

      try {
        const response = await createPlatformPost(storyId, {
          platformType: payload.platformType as "input" | "note" | "comment" | "link",
          body: payload.body,
          content: payload.content,
          color: payload.color,
        });

        setPostsData((current) => mergePosts(current, [response.post]));
        setSelectedPostId(response.post.id);
        setAnalyzingPostId(response.post.id);
        return true;
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to post to platform."
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [storyId]
  );

  const applyItem = useCallback(
    async (itemId: string) => {
      if (!storyId?.trim()) {
        return;
      }

      setApplyingItemId(itemId);
      setActionError(null);

      try {
        const result = await applyPlatformItem(storyId, itemId);

        setPostsData((current) =>
          current.map((post) => ({
            ...post,
            items: post.items.map((item) =>
              item.id === itemId ? result.item : item
            ),
          }))
        );

        await refreshAll();

        if (result.sceneShortId) {
          registerSceneInOrganizer(result.sceneShortId);
        }
      } catch (caughtError) {
        setActionError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to add this item to your storyboard."
        );
      } finally {
        setApplyingItemId(null);
      }
    },
    [refreshAll, registerSceneInOrganizer, storyId]
  );

  const rejectItemHandler = useCallback(
    async (itemId: string) => {
      if (!storyId?.trim()) {
        return;
      }

      setActionError(null);

      try {
        const result = await rejectPlatformItem(storyId, itemId);
        setPostsData((current) =>
          current.map((post) => ({
            ...post,
            items: post.items.map((item) =>
              item.id === itemId ? result.item : item
            ),
          }))
        );
      } catch (caughtError) {
        setActionError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to dismiss this suggestion."
        );
      }
    },
    [storyId]
  );

  const posts = useMemo(
    () => postsData.map(mapApiPostToUiPost),
    [postsData]
  );

  const postItems = useMemo(() => {
    const selectedPost = postsData.find((post) => post.id === selectedPostId);
    if (!selectedPost) {
      return [];
    }

    return selectedPost.items.filter(isActionableItem).map(mapItemToPostItemProps);
  }, [postsData, selectedPostId]);

  const value = useMemo(
    () => ({
      posts,
      postItems,
      selectedPostId,
      postsLoading,
      submitting,
      analyzingPostId,
      applyingItemId,
      error,
      actionError,
      selectPost,
      submitPost,
      applyItem,
      rejectItem: rejectItemHandler,
    }),
    [
      actionError,
      analyzingPostId,
      applyItem,
      applyingItemId,
      error,
      postItems,
      posts,
      postsLoading,
      rejectItemHandler,
      selectPost,
      selectedPostId,
      submitPost,
      submitting,
    ]
  );

  return (
    <PlatformBoardContext.Provider value={value}>
      {children}
    </PlatformBoardContext.Provider>
  );
};
