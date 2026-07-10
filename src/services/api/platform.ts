import { nestApiRequest } from "@/lib/nest-api";
import type { PlatformActionItem } from "@/services/api/story";

export type PlatformInputType = "input" | "note" | "comment" | "link";
export type PlatformItemStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AppliedEntityType = "mention" | "scene" | "note";

export interface PlatformItemData {
  id: string;
  storyId: string;
  postId: string | null;
  action: string | null;
  body: string | null;
  data: PlatformActionItem["data"];
  status: PlatformItemStatus;
  appliedEntityId: string | null;
  appliedEntityType: AppliedEntityType | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
}

export interface PlatformPostData {
  id: string;
  storyId: string;
  platformType: PlatformInputType;
  type: string;
  body: string | null;
  color: string | null;
  content: unknown;
  createdAt: string;
  updatedAt: string;
  items: PlatformItemData[];
}

export interface CreatePlatformPostPayload {
  platformType: PlatformInputType;
  body: string;
  content?: unknown;
  color?: string;
}

export interface CreatePlatformPostResponse {
  accepted: boolean;
  post: PlatformPostData;
}

export interface ApplyPlatformItemResponse {
  item: PlatformItemData;
  appliedEntityId: string | null;
  appliedEntityType: AppliedEntityType | null;
  sceneShortId?: string | null;
  intelligenceQueued: boolean;
  idempotent: boolean;
}

export interface PlatformSocketEventData {
  postId?: string;
  wordCount: number;
  thresholdWordCount: number;
  thresholdReached: boolean;
  answeredCount: number;
  thresholdMet: boolean;
  translation: { actions: PlatformActionItem[]; meta: { wordCount: number; entityCount: number } } | null;
  items?: PlatformItemData[];
}

export const getPlatformPosts = async (
  storyId: string
): Promise<PlatformPostData[]> => {
  return nestApiRequest<PlatformPostData[]>({
    path: `/stories/${storyId}/platform/posts`,
    cache: "no-store",
  });
};

export const createPlatformPost = async (
  storyId: string,
  payload: CreatePlatformPostPayload
): Promise<CreatePlatformPostResponse> => {
  return nestApiRequest<CreatePlatformPostResponse>({
    path: `/stories/${storyId}/platform/posts`,
    method: "POST",
    body: payload,
  });
};

export const applyPlatformItem = async (
  storyId: string,
  itemId: string
): Promise<ApplyPlatformItemResponse> => {
  return nestApiRequest<ApplyPlatformItemResponse>({
    path: `/stories/${storyId}/platform/items/${itemId}/apply`,
    method: "POST",
  });
};

export const rejectPlatformItem = async (
  storyId: string,
  itemId: string,
  reason?: string
): Promise<{ item: PlatformItemData }> => {
  return nestApiRequest<{ item: PlatformItemData }>({
    path: `/stories/${storyId}/platform/items/${itemId}/reject`,
    method: "POST",
    body: reason ? { reason } : {},
  });
};
