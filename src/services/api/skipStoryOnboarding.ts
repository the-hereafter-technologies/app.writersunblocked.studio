import { nestApiRequest } from "@/lib/nest-api";

export interface SkipOnboarding {
  skipped: true;
}

export const skipStoryOnboarding = async (
  storyId: string
): Promise<SkipOnboarding> => {
  return nestApiRequest<SkipOnboarding>({
    path: `/storyboard/${storyId}/skip-onboarding`,
    method: "GET",
  });
};
