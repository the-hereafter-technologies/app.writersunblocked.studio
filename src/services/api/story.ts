import { nestApiRequest } from "@/lib/nest-api";
import type { StoryMention, StoryScene } from "@writersunblocked/ui";
import type { HighlightBackgroundColors } from "../hooks/useHighlightColors";

export type StoryMode = "novel" | "screenplay";

export interface StoryData {
  id: string;
  title: string;
  mode?: StoryMode;
  penName?: string | null;
  wordCount: number;
  onboardingComplete?: boolean;
  content: string;
  contentJSON?: unknown;
  metadata?: Record<string, unknown> | null;
  subscriptionStatus?: string | null;
  scenes?: StoryScene[];
}

export interface WorldCanonData {
  id: string;
  storyId: string;
  rules: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DreamThreadData {
  id: string;
  storyId: string;
  type:
    | "character_tension"
    | "world_pressure"
    | "location_potential"
    | "plotline_gap";
  body: string;
  sourceEntities: string[];
  version: number;
  createdAt: string;
}

export interface StoryboardNoteData {
  id: string;
  storyId: string;
  sceneId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoryboardCommentAuthor {
  id: string;
  name: string | null;
  image: string | null;
  handle: string | null;
}

export interface StoryboardCommentData {
  id: string;
  storyId: string;
  blockId: string;
  userId: string;
  parentId: string | null;
  body: string;
  anchorOffset: number | null;
  anchorLength: number | null;
  anchorText: string | null;
  isStale: boolean;
  resolvedAt: string | null;
  resolvedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: StoryboardCommentAuthor;
  replies?: StoryboardCommentData[];
}

export interface CreateStoryboardCommentPayload {
  blockId: string;
  parentId?: string;
  body: string;
  anchorOffset?: number;
  anchorLength?: number;
  anchorText?: string;
}

export interface ListStoryboardCommentsQuery {
  blockId?: string;
  includeResolved?: boolean;
}

export interface OnboardingAnswers {
  setting: string;
  era: string;
  magicOrTech: string;
  characters: string;
  relationships: string;
  conflict: string;
  plotBeats: string;
}

export interface PlannerQuestionStatus {
  question: string;
  answered: boolean;
  evidence?: string;
}

export interface PlannerExtractedCharacter {
  name: string;
  description: string;
}

export interface PlannerExtractedLocation {
  name: string;
  description: string;
}

export interface PlannerExtractedPlotline {
  title: string;
  note?: string;
}

export interface PlatformActionField {
  label: string;
  type: "text" | "number" | "option";
  value: string | number | string[];
}

export interface PlatformActionItem {
  action: string;
  body: string;
  data: PlatformActionField[];
}

export interface PlatformActionResponse {
  actions: PlatformActionItem[];
  meta: {
    wordCount: number;
    entityCount: number;
  };
}

export interface AnalyzePlannerDraftResponse {
  wordCount: number;
  thresholdWordCount: number;
  thresholdReached: boolean;
  answeredCount: number;
  thresholdMet: boolean;
  questions: PlannerQuestionStatus[];
  translation?: PlatformActionResponse | null;
}

export interface SceneNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SceneSettings {
  pov?: string;
  tense?: string;
  perspective?: string | null;
}

export interface ApiSceneVersion {
  id: string;
  shortId: string;
  data?: unknown;
  plainText?: string | null;
  wordCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiScene {
  id: string;
  shortId: string;
  label?: string | null;
  order: number;
  visible?: boolean;
  color?: string | null;
  activeVersionId?: string | null;
  settings?: SceneSettings;
  versions?: ApiSceneVersion[];
  threadCount?: number;
  mentionCount?: number;
  notes?: SceneNote[];
  mentions?: StoryMention[];
  comments?: StoryboardCommentData[];
  characters?: SceneCharacter[];
  locations?: SceneLocation[];
}

export interface SceneCharacter {
  id: string;
  name: string;
  initials: string;
  color: keyof HighlightBackgroundColors;
}

export interface SceneLocation {
  id: string;
  name: string;
  color: string;
}

export interface Scene {
  id: string;
  shortId: string;
  title: string;
  order: number;
  visible: boolean;
  wordCount: number;
  color: keyof HighlightBackgroundColors;
  threadCount: number;
  mentionCount: number;
  chapters: string[];
  notes: SceneNote[];
  mentions: StoryMention[];
  comments: StoryboardCommentData[];
  label?: string;
  activeVersionId?: string;
  settings?: SceneSettings;
  versions?: ApiSceneVersion[];
}

export interface StoryCharacter {
  id: string;
  name: string;
  initials: string;
  color: keyof HighlightBackgroundColors;
  weight: number;
  mentionCount: number;
  model?: unknown;
  plotlines?: unknown[];
}

export interface StoryLocation {
  id: string;
  name: string;
  description?: string;
  mentionCount?: number;
  color?: keyof HighlightBackgroundColors;
}

export type MentionType = "person" | "place" | "thing" | "group";
export type MentionStatus = "pending" | "confirmed";

export interface CreateMentionPayload {
  name: string;
  mentionType?: MentionType;
  status?: MentionStatus;
  color?: keyof HighlightBackgroundColors;
  description?: string;
}

export interface UpdateMentionPayload {
  name?: string;
  mentionType?: MentionType;
  status?: MentionStatus;
  color?: keyof HighlightBackgroundColors;
  description?: string;
}

export interface StorySavePayload {
  title?: string;
  penName?: string | null;
  content: string;
  contentJSON: unknown;
  wordCount: number;
}

export interface SceneSavePayload {
  content: string;
  contentJSON: unknown;
  wordCount: number;
}

export interface SceneUpdatePayload {
  label?: string;
  order?: number;
  visible?: boolean;
  color?: keyof HighlightBackgroundColors;
}

export interface CreateScenePayload {
  title?: string;
  order?: number;
  visible?: boolean;
  color?: keyof HighlightBackgroundColors;
}

export interface AnalyzeQueueResponse {
  queued: boolean;
  blockId: string;
}

export const getStory = async (storyId: string): Promise<StoryData> => {
  return nestApiRequest<StoryData>({
    path: `/stories/${storyId}`,
    cache: "no-store",
  });
};

export const patchStory = async (
  storyId: string,
  payload: StorySavePayload
): Promise<StoryData> => {
  return nestApiRequest<StoryData>({
    path: `/stories/${storyId}`,
    method: "PATCH",
    body: payload,
  });
};

export const patchStoryMetadata = async (
  storyId: string,
  metadata: Record<string, unknown>
): Promise<{ id: string; metadata: Record<string, unknown> | null }> => {
  return nestApiRequest<{ id: string; metadata: Record<string, unknown> | null }>({
    path: `/stories/${storyId}/metadata`,
    method: "PATCH",
    body: { metadata },
  });
};

export const getScenes = async (storyId: string): Promise<ApiScene[]> => {
  return nestApiRequest<ApiScene[]>({
    path: `/stories/${storyId}/scenes`,
    cache: "no-store",
  });
};

export const createScene = async (
  storyId: string,
  payload: CreateScenePayload = {}
): Promise<ApiScene> => {
  const { title, ...rest } = payload;

  return nestApiRequest<ApiScene>({
    path: `/stories/${storyId}/scenes`,
    method: "POST",
    body: {
      ...rest,
      ...(title !== undefined ? { label: title } : {}),
    },
  });
};

export const patchSceneContent = async (
  storyId: string,
  sceneId: string,
  payload: SceneSavePayload
): Promise<StoryData> => {
  return nestApiRequest<StoryData>({
    path: `/stories/${storyId}/scenes/${sceneId}/content`,
    method: "PATCH",
    body: payload,
  });
};

export const getThreads = async (storyId: string): Promise<unknown[]> => {
  return nestApiRequest<unknown[]>({
    path: `/stories/${storyId}/threads`,
    cache: "no-store",
  });
};

export const getCharacters = async (
  storyId: string
): Promise<StoryCharacter[]> => {
  return nestApiRequest<StoryCharacter[]>({
    path: `/stories/${storyId}/characters`,
    cache: "no-store",
  });
};

export const getLocations = async (
  storyId: string
): Promise<StoryLocation[]> => {
  return nestApiRequest<StoryLocation[]>({
    path: `/stories/${storyId}/locations`,
    cache: "no-store",
  });
};

export const getMentions = async (
  storyId: string,
  params?: { mentionType?: MentionType; status?: MentionStatus }
): Promise<StoryMention[]> => {
  const query = new URLSearchParams();
  if (params?.mentionType) {
    query.set("mentionType", params.mentionType);
  }
  if (params?.status) {
    query.set("status", params.status);
  }

  const queryString = query.toString();

  return nestApiRequest<StoryMention[]>({
    path: `/stories/${storyId}/mentions${queryString ? `?${queryString}` : ""}`,
    cache: "no-store",
  });
};

export const createMention = async (
  storyId: string,
  payload: CreateMentionPayload
): Promise<StoryMention> => {
  return nestApiRequest<StoryMention>({
    path: `/stories/${storyId}/mentions`,
    method: "POST",
    body: payload,
  });
};

export const patchMention = async (
  mentionId: string,
  payload: UpdateMentionPayload
): Promise<StoryMention> => {
  return nestApiRequest<StoryMention>({
    path: `/mentions/${mentionId}`,
    method: "PATCH",
    body: payload,
  });
};

export const confirmMention = async (
  mentionId: string,
  mentionType: MentionType
): Promise<StoryMention> => {
  return nestApiRequest<StoryMention>({
    path: `/mentions/${mentionId}/confirm`,
    method: "POST",
    body: { mentionType },
  });
};

export const deleteMention = async (mentionId: string): Promise<void> => {
  await nestApiRequest<void>({
    path: `/mentions/${mentionId}`,
    method: "DELETE",
  });
};

export const enqueueSceneAnalysis = async (
  sceneId: string
): Promise<AnalyzeQueueResponse> => {
  return nestApiRequest<AnalyzeQueueResponse>({
    path: `/scenes/${sceneId}/analyze`,
    method: "POST",
  });
};

export const getWorldCanon = async (
  storyId: string
): Promise<WorldCanonData> => {
  return nestApiRequest<WorldCanonData>({
    path: `/stories/${storyId}/world-canon`,
    cache: "no-store",
  });
};

export const patchWorldCanon = async (
  storyId: string,
  rules: Record<string, unknown>
): Promise<WorldCanonData> => {
  return nestApiRequest<WorldCanonData>({
    path: `/stories/${storyId}/world-canon`,
    method: "PATCH",
    body: { rules },
  });
};

export const getDreamThreads = async (
  storyId: string
): Promise<DreamThreadData[]> => {
  return nestApiRequest<DreamThreadData[]>({
    path: `/stories/${storyId}/dream-threads`,
    cache: "no-store",
  });
};

export const onboardStory = async (
  storyId: string,
  answers: OnboardingAnswers
): Promise<{ accepted: boolean }> => {
  return nestApiRequest<{ accepted: boolean }>({
    path: `/storyboard/${storyId}/onboard`,
    method: "POST",
    body: { answers },
  });
};

export const analyzePlannerDraft = async (
  storyId: string,
  draft: string
): Promise<AnalyzePlannerDraftResponse> => {
  const response = await nestApiRequest<AnalyzePlannerDraftResponse>({
    path: `/storyboard/${storyId}/platform`,
    method: "POST",
    body: { body: draft },
    timeoutMs: 30000, // AI analysis can take 10-15s, allow up to 30s
  });

  return response;
};

export const getStoryboardNotes = async (
  storyId: string
): Promise<StoryboardNoteData[]> => {
  return nestApiRequest<StoryboardNoteData[]>({
    path: `/stories/${storyId}/notes`,
    cache: "no-store",
  });
};

export const createStoryboardNote = async (
  storyId: string,
  payload: { sceneId: string; body: string }
): Promise<StoryboardNoteData> => {
  return nestApiRequest<StoryboardNoteData>({
    path: `/stories/${storyId}/notes`,
    method: "POST",
    body: payload,
  });
};

export const patchStoryboardNote = async (
  storyId: string,
  noteId: string,
  payload: { body: string }
): Promise<StoryboardNoteData> => {
  return nestApiRequest<StoryboardNoteData>({
    path: `/stories/${storyId}/notes/${noteId}`,
    method: "PATCH",
    body: payload,
  });
};

export const getStoryboardComments = async (
  storyId: string,
  query?: ListStoryboardCommentsQuery
): Promise<StoryboardCommentData[]> => {
  const params = new URLSearchParams();

  if (query?.blockId) {
    params.set("blockId", query.blockId);
  }

  if (query?.includeResolved !== undefined) {
    params.set("includeResolved", query.includeResolved ? "true" : "false");
  }

  const qs = params.toString();

  return nestApiRequest<StoryboardCommentData[]>({
    path: `/stories/${storyId}/comments${qs ? `?${qs}` : ""}`,
    cache: "no-store",
  });
};

export const createStoryboardComment = async (
  storyId: string,
  payload: CreateStoryboardCommentPayload
): Promise<StoryboardCommentData> => {
  return nestApiRequest<StoryboardCommentData>({
    path: `/stories/${storyId}/comments`,
    method: "POST",
    body: payload,
  });
};

export const patchStoryboardComment = async (
  storyId: string,
  commentId: string,
  payload: { body: string }
): Promise<StoryboardCommentData> => {
  return nestApiRequest<StoryboardCommentData>({
    path: `/stories/${storyId}/comments/${commentId}`,
    method: "PATCH",
    body: payload,
  });
};

export const deleteStoryboardComment = async (
  storyId: string,
  commentId: string
): Promise<{ id: string; deleted: boolean; deletedCount: number }> => {
  return nestApiRequest<{ id: string; deleted: boolean; deletedCount: number }>(
    {
      path: `/stories/${storyId}/comments/${commentId}`,
      method: "DELETE",
    }
  );
};

export const resolveStoryboardComment = async (
  storyId: string,
  commentId: string
): Promise<StoryboardCommentData> => {
  return nestApiRequest<StoryboardCommentData>({
    path: `/stories/${storyId}/comments/${commentId}/resolve`,
    method: "POST",
  });
};

export const reopenStoryboardComment = async (
  storyId: string,
  commentId: string
): Promise<StoryboardCommentData> => {
  return nestApiRequest<StoryboardCommentData>({
    path: `/stories/${storyId}/comments/${commentId}/reopen`,
    method: "POST",
  });
};

export const updateSceneTitle = async (
  storyId: string,
  sceneId: string,
  title: string
): Promise<ApiScene> => {
  return nestApiRequest<ApiScene>({
    path: `/stories/${storyId}/scenes/${sceneId}`,
    method: "PATCH",
    body: { label: title },
  });
};

export const patchScene = async (
  storyId: string,
  sceneId: string,
  payload: SceneUpdatePayload
): Promise<ApiScene> => {
  return nestApiRequest<ApiScene>({
    path: `/stories/${storyId}/scenes/${sceneId}`,
    method: "PATCH",
    body: payload,
  });
};

export const deleteScene = async (
  storyId: string,
  sceneId: string
): Promise<void> => {
  await nestApiRequest<void>({
    path: `/stories/${storyId}/scenes/${sceneId}`,
    method: "DELETE",
  });
};
