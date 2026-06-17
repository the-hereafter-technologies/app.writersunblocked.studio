import { useContext } from "react";
import { StoryboardContext } from "./utils";

export const useStoryboard = () => {
  const context = useContext(StoryboardContext);
  if (!context) {
    throw new Error("useBoard must be used within a StoryBoardProvider");
  }
  return context;
};
