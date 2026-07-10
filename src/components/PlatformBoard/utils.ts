"use client";

import { createContext, useContext } from "react";
import type { PlatformPostData, PlatformItemData } from "@/services/api/platform";
import type { PlatformPost } from "@writersunblocked/ui/app";
import type { PlatformPostItemProps } from "@writersunblocked/ui/app";

export type PlatformBoardPost = PlatformPost & { id: string };

export type PlatformBoardContextValue = {
  posts: PlatformBoardPost[];
  postItems: Array<PlatformPostItemProps & { id: string }>;
  selectedPostId: string | null;
  postsLoading: boolean;
  submitting: boolean;
  analyzingPostId: string | null;
  applyingItemId: string | null;
  error: string | null;
  actionError: string | null;
  selectPost: (postId: string) => void;
  submitPost: (payload: {
    platformType: string;
    body: string;
    content?: unknown;
    color?: string;
  }) => Promise<boolean>;
  applyItem: (itemId: string) => Promise<void>;
  rejectItem: (itemId: string) => Promise<void>;
};

export const PlatformBoardContext = createContext<PlatformBoardContextValue | null>(
  null
);

export const usePlatformBoard = (): PlatformBoardContextValue => {
  const context = useContext(PlatformBoardContext);
  if (!context) {
    throw new Error("usePlatformBoard must be used within PlatformBoardProvider");
  }
  return context;
};

export const mapApiPostToUiPost = (post: PlatformPostData): PlatformBoardPost => ({
  id: post.id,
  type: post.platformType as PlatformPost["type"],
  tags: [],
  createdAt: post.createdAt,
  body: post.body ?? undefined,
  color: (post.color as PlatformPost["color"]) ?? undefined,
});

export const pickDefaultPostId = (posts: PlatformPostData[]): string | null => {
  const withItems = posts.find((post) => post.items.some((item) => Boolean(item.action)));
  return withItems?.id ?? posts[0]?.id ?? null;
};

export const isActionableItem = (item: PlatformItemData): boolean => Boolean(item.action);
