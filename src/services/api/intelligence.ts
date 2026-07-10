import { nestApiRequest } from "@/lib/nest-api";

export type ThreadLayer =
  | "character_arc"
  | "relationship"
  | "plot_line"
  | "subplot"
  | "beat"
  | "world_rule"
  | "tone";

export type ThreadStatus = "open" | "advanced" | "resolved" | "contradicted";

export type CanonStatus = "canon" | "intent";

export interface IntelligenceThread {
  id: string;
  storyId: string;
  layer: ThreadLayer;
  status: ThreadStatus;
  canonStatus: CanonStatus;
  confidence: number;
  summary: string;
  body: Record<string, unknown>;
  pecFlags: string[];
  sourceInputId: string | null;
  mentionIds: string[];
  sceneIds: string[];
  relatedThreadIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoryIntelligenceContext {
  version: string;
  canon: {
    characterNotes: Array<{
      name: string;
      summary: string;
      body: Record<string, unknown>;
    }>;
    worldRules: string[];
    toneNotes: string[];
  };
  intent: {
    openThreads: Array<{ layer: ThreadLayer; summary: string }>;
    conflicts: Array<{ summary: string; pecFlags: string[] }>;
  };
  mentions: Array<{ id: string; name: string; type: string }>;
}

export interface IntelligenceRun {
  id: string;
  storyId: string;
  inputId: string;
  jobType: string;
  status: string;
  sceneId: string | null;
  threadsCreated: number;
  threadsUpdated: number;
  diagnostic: string | null;
  durationMs: number | null;
  createdAt: string;
  completedAt: string | null;
}

export interface AnalyzeIntelligenceResponse {
  queued: boolean;
  sceneId: string;
  reason: string;
  inputId: string;
}

export interface IntelligenceThreadQuery {
  layer?: ThreadLayer;
  canonStatus?: CanonStatus;
  sceneId?: string;
  status?: ThreadStatus;
}

export const getIntelligenceThreads = async (
  storyId: string,
  query?: IntelligenceThreadQuery
): Promise<IntelligenceThread[]> => {
  const params = new URLSearchParams();
  if (query?.layer) params.set("layer", query.layer);
  if (query?.canonStatus) params.set("canonStatus", query.canonStatus);
  if (query?.sceneId) params.set("sceneId", query.sceneId);
  if (query?.status) params.set("status", query.status);

  const search = params.toString();
  return nestApiRequest<IntelligenceThread[]>({
    path: `/stories/${storyId}/intelligence/threads${search ? `?${search}` : ""}`,
    cache: "no-store",
  });
};

export const getIntelligenceContext = async (
  storyId: string,
  sceneId?: string
): Promise<StoryIntelligenceContext> => {
  const params = sceneId ? `?sceneId=${encodeURIComponent(sceneId)}` : "";
  return nestApiRequest<StoryIntelligenceContext>({
    path: `/stories/${storyId}/intelligence/context${params}`,
    cache: "no-store",
  });
};

export const getIntelligenceRuns = async (
  storyId: string
): Promise<IntelligenceRun[]> => {
  return nestApiRequest<IntelligenceRun[]>({
    path: `/stories/${storyId}/intelligence/runs`,
    cache: "no-store",
  });
};

export const analyzeSceneIntelligence = async (
  storyId: string,
  sceneId: string
): Promise<AnalyzeIntelligenceResponse> => {
  return nestApiRequest<AnalyzeIntelligenceResponse>({
    path: `/stories/${storyId}/scenes/${sceneId}/intelligence/analyze`,
    method: "POST",
  });
};
