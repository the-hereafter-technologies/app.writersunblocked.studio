import type { StoryboardScreen } from "@writersunblocked/ui";

export interface StoryboardContextType {
  screen: StoryboardScreen;
  openBoard: (screen?: StoryboardScreen, entityId?: string) => void;
  closeBoard: () => void;
  isStoryboardOpen: boolean;
}
