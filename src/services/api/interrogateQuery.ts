import { nestApiRequest } from "@/lib/nest-api";

export interface InterrogationStatus {
  question: string;
  answered: boolean;
  evidence?: string;
}
export const interrogateQuery = async (
  storyId: string,
  draft: string,
  questions: string[]
): Promise<InterrogationStatus> => {
  const response = await nestApiRequest<InterrogationStatus>({
    path: `/storyboard/${storyId}/interrogate`,
    method: "POST",
    body: { body: draft, questions },
    timeoutMs: 30000, // AI analysis can take 10-15s, allow up to 30s
  });

  return response;
};
