"use client";

import { EditorMode } from "@writersunblocked/ui/app";
import type { EditorSuggestionItem } from "@writersunblocked/ui/app";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzeCopyEditor,
  analyzeLineEditor,
  submitLineEditorFeedback,
} from "@/services/api/editor-analysis";

type UseEditorAnalysisParams = {
  storyId?: string;
  editorMode: EditorMode;
  disabled?: boolean;
};

export function useEditorAnalysis({
  storyId,
  editorMode,
  disabled = false,
}: UseEditorAnalysisParams) {
  const [suggestionItemsBySceneId, setSuggestionItemsBySceneId] = useState<
    Record<string, EditorSuggestionItem[]>
  >({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const inFlightRef = useRef<Map<string, AbortController>>(new Map());
  const requestIdRef = useRef(0);

  const isAnalysisMode = editorMode === EditorMode.Copy || editorMode === EditorMode.Line;

  useEffect(() => {
    if (!isAnalysisMode) {
      setSuggestionItemsBySceneId({});
      setIsAnalyzing(false);
    }
  }, [isAnalysisMode]);

  useEffect(() => {
    return () => {
      for (const controller of inFlightRef.current.values()) {
        controller.abort();
      }
      inFlightRef.current.clear();
    };
  }, []);

  const handleAnalyzeRequest = useCallback(
    async (sceneId: string, plainText: string) => {
      if (!storyId || disabled || !isAnalysisMode || !plainText.trim()) {
        return;
      }

      const existing = inFlightRef.current.get(sceneId);
      existing?.abort();

      const controller = new AbortController();
      inFlightRef.current.set(sceneId, controller);
      const requestId = ++requestIdRef.current;

      setIsAnalyzing(true);

      try {
        const analyze =
          editorMode === EditorMode.Copy ? analyzeCopyEditor : analyzeLineEditor;

        const result = await analyze(storyId, sceneId, { plainText });

        if (controller.signal.aborted) {
          return;
        }

        setSuggestionItemsBySceneId((current) => ({
          ...current,
          [sceneId]: result.suggestions,
        }));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Editor analysis failed", error);
        }
      } finally {
        inFlightRef.current.delete(sceneId);

        if (requestId === requestIdRef.current) {
          setIsAnalyzing(inFlightRef.current.size > 0);
        }
      }
    },
    [disabled, editorMode, isAnalysisMode, storyId]
  );

  const handleApplyFix = useCallback(
    (sceneId: string, suggestionId: string, _replacement: string) => {
      setSuggestionItemsBySceneId((current) => ({
        ...current,
        [sceneId]: (current[sceneId] ?? []).filter((item) => item.id !== suggestionId),
      }));
    },
    []
  );

  const handleLineFeedback = useCallback(
    async (sceneId: string, suggestionId: string, userInput: string) => {
      if (!storyId || disabled) {
        return;
      }

      try {
        await submitLineEditorFeedback(storyId, sceneId, suggestionId, { userInput });
        setSuggestionItemsBySceneId((current) => ({
          ...current,
          [sceneId]: (current[sceneId] ?? []).filter((item) => item.id !== suggestionId),
        }));
      } catch (error) {
        console.error("Line editor feedback failed", error);
      }
    },
    [disabled, storyId]
  );

  return {
    suggestionItemsBySceneId,
    isAnalyzing,
    handleAnalyzeRequest,
    handleApplyFix,
    handleLineFeedback,
  };
}
