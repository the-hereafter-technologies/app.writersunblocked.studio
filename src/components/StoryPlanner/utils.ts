import type { AnalyzePlannerDraftResponse } from "@/services/api/story";
import type { Interrogation } from "@/services/hooks/useInterrogate";
import { createContext, useContext } from "react";

export interface StoryPlannerContextType {
  questions: string[];
  draft: string;
  setDraft: (value: string) => void;
  analysis: AnalyzePlannerDraftResponse;
  analysisLoading: boolean;
  submitting: boolean;
  interrogation: Interrogation;
  awaitingCompletion: boolean;
  error: string | null;
  wordCount: number;
  minWords: number;
  maxWords: number;
  canGenerate: boolean;
  resetDraft: () => void;
  generateStoryboard: () => Promise<void>;
}

export const StoryPlannerContext =
  createContext<StoryPlannerContextType | null>(null);

export const useStoryPlanner = (): StoryPlannerContextType => {
  const context = useContext(StoryPlannerContext);
  if (!context) {
    throw new Error("useStoryPlanner must be used within PlannerProvider");
  }

  return context;
};
