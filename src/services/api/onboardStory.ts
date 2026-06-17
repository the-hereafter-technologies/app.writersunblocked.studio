import { nestApiRequest } from "@/lib/nest-api";
import type {
  StoryboardNote,
  StoryboardPlotPoint,
  StoryMention,
} from "@writersunblocked/ui";
import type { Scene } from "./story";

export interface OnboardResources {
  mentions: StoryMention[];
  scenes: Scene[];
  notes: StoryboardNote[];
  plotPoint: StoryboardPlotPoint[];
}

export const onboardStory = async (
  storyId: string,
  resources: OnboardResources
): Promise<{ accepted: boolean }> => {
  return nestApiRequest<{ accepted: boolean }>({
    path: `/storyboard/${storyId}/onboard`,
    method: "POST",
    body: { ...resources },
  });
};
