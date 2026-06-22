import { StoryboardScreen } from "@writersunblocked/ui/app";
import { createContext } from "react";
import type { StoryboardContextType } from "./types";

export const StoryboardContext = createContext<StoryboardContextType>({
  screen: StoryboardScreen.Scene,
  openBoard: () => {},
  closeBoard: () => {},
  isStoryboardOpen: false,
});
