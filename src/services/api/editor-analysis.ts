import { nestApiRequest } from "@/lib/nest-api";
import type {
  EditorAnalysisResult,
  LineEditorFeedbackResult,
} from "@writersunblocked/ui/app";

type AnalyzeScenePayload = {
  plainText: string;
};

export async function analyzeCopyEditor(
  storyId: string,
  sceneId: string,
  payload: AnalyzeScenePayload
): Promise<EditorAnalysisResult> {
  return nestApiRequest<EditorAnalysisResult>({
    path: `/stories/${storyId}/scenes/${sceneId}/analyze/copy`,
    method: "POST",
    body: payload,
    timeoutMs: 15000,
  });
}

export async function analyzeLineEditor(
  storyId: string,
  sceneId: string,
  payload: AnalyzeScenePayload
): Promise<EditorAnalysisResult> {
  return nestApiRequest<EditorAnalysisResult>({
    path: `/stories/${storyId}/scenes/${sceneId}/analyze/line`,
    method: "POST",
    body: payload,
    timeoutMs: 30000,
  });
}

export async function submitLineEditorFeedback(
  storyId: string,
  sceneId: string,
  suggestionId: string,
  payload: { userInput: string }
): Promise<LineEditorFeedbackResult> {
  return nestApiRequest<LineEditorFeedbackResult>({
    path: `/stories/${storyId}/scenes/${sceneId}/analyze/line/${suggestionId}/respond`,
    method: "POST",
    body: payload,
    timeoutMs: 30000,
  });
}
