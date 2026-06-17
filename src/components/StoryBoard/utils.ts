import { StoryboardScreen } from "@writersunblocked/ui";
import { createContext } from "react";
import type { StoryboardContextType } from "./types";

export const StoryboardContext = createContext<StoryboardContextType>({
  screen: StoryboardScreen.Scene,
  openBoard: () => {},
  closeBoard: () => {},
  isStoryboardOpen: false,
});
