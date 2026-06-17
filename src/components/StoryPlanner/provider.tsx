"use client";
import { onboardStory } from "@/services/api/onboardStory";
import {
  type AnalyzePlannerDraftResponse,
  analyzePlannerDraft,
} from "@/services/api/story";
import { useInterrogate } from "@/services/hooks/useInterrogate";
import { connectStoryboardSocket } from "@/services/sockets/storyboard.socket";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { plannerQuestions } from "./planner-questions";
import { StoryPlannerContext } from "./utils";

export const MAX_WORDS = 300;
export const ANALYSIS_DEBOUNCE_MS = 1500;
export const ANALYSIS_MIN_WORDS = 20;

type PlannerProviderProps = {
  storyId: string;
  onCompleted: () => Promise<void> | void;
  children: React.ReactNode;
};

const createEmptyAnalysis = (
  wordCount: number
): AnalyzePlannerDraftResponse => ({
  wordCount,
  thresholdWordCount: ANALYSIS_MIN_WORDS,
  thresholdReached: wordCount >= ANALYSIS_MIN_WORDS,
  answeredCount: 0,
  thresholdMet: false,
  questions: plannerQuestions.map((question) => ({
    question,
    answered: false,
  })),
  translation: null,
});

const countWords = (value: string): number => {
  const matches = value.trim().match(/\S+/g);
  return matches?.length ?? 0;
};

export const PlannerProvider = ({
  storyId,
  onCompleted,
  children,
}: PlannerProviderProps) => {
  const [draft, setDraft] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzePlannerDraftResponse>(
    createEmptyAnalysis(0)
  );
  const { interrogate, interrogation, handleInterrogateSuccess } = useInterrogate(
    storyId,
    [
      "Who is at the center of this story?",
      "Where does the story take place?",
      "What happens that changes everything?",
      "What does your protagonist want or need?",
      "What stands in the way?",
    ],
  );
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingCompletion, setAwaitingCompletion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analysisRunRef = useRef(0);
  const wordCount = useMemo(() => countWords(draft), [draft]);

  useEffect(() => {
    if (!storyId?.trim()) return;

    const socket = connectStoryboardSocket(storyId, {
      onPlatformSuccess: (event) => {
        setAnalysis((prev) => ({
          ...prev,
          ...event.data,
        }));
        setAnalysisLoading(false);
      },
      onInterrogateSuccess: (event) => {
        handleInterrogateSuccess(event.data);
      },
      onOnboardingComplete: () => {
        setAwaitingCompletion(false);
        void onCompleted();
      },
    });

    return () => {
      socket?.disconnect();
    };
  }, [handleInterrogateSuccess, onCompleted, storyId]);

  useEffect(() => {
    if (draft.trim() === "") return;
    interrogate(draft.trim(), [
      "Who is at the center of this story?",
      "Where does the story take place?",
      "What happens that changes everything?",
      "What does your protagonist want or need?",
      "What stands in the way?",
    ]);
  }, [draft, interrogate]);

  useEffect(() => {
    if (!interrogation.thresholdReached) {
      return;
    }

    setAnalysis((current) => {
      if (wordCount < ANALYSIS_MIN_WORDS) {
        return createEmptyAnalysis(wordCount);
      }

      return { ...current, wordCount, thresholdReached: true };
    });

    if (wordCount < ANALYSIS_MIN_WORDS) {
      setAnalysisLoading(false);
      return;
    }

    const handle = window.setTimeout(async () => {
      const runId = analysisRunRef.current + 1;
      analysisRunRef.current = runId;
      setAnalysisLoading(true);
      try {
        await analyzePlannerDraft(storyId, draft);
        if (analysisRunRef.current !== runId) {
          return;
        }
        setError(null);
        // result arrives via socket onPlatformSuccess
      } catch (caughtError) {
        if (analysisRunRef.current !== runId) {
          return;
        }
        setAnalysisLoading(false);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to analyze your draft right now."
        );
      }
    }, ANALYSIS_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(handle);
    };
  }, [draft, storyId, wordCount, interrogation]);

  const resetDraft = () => {
    setDraft("");
    setAnalysis(createEmptyAnalysis(0));
    setError(null);
  };

  const generateStoryboard = useCallback(async () => {
    if (submitting || awaitingCompletion) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onboardStory(storyId, analysis.translation);
      setAwaitingCompletion(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to start storyboard generation."
      );
    } finally {
      setSubmitting(false);
    }
  }, [analysis, submitting, awaitingCompletion, storyId]);

  const canGenerate =
    interrogation.thresholdReached && !submitting && !awaitingCompletion;

  return (
    <StoryPlannerContext.Provider
      value={{
        questions: plannerQuestions,
        draft,
        setDraft,
        analysis,
        analysisLoading,
        submitting,
        awaitingCompletion,
        error,
        wordCount,
        minWords: ANALYSIS_MIN_WORDS,
        maxWords: MAX_WORDS,
        canGenerate,
        resetDraft,
        interrogation,
        generateStoryboard,
      }}
    >
      {children}
    </StoryPlannerContext.Provider>
  );
};
