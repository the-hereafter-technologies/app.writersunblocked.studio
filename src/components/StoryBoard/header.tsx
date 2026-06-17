"use client";
import { useStory } from "@/containers/StoryPage";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import {
  StoryboardNavigator,
  type StoryboardScreen,
} from "@writersunblocked/ui";
import { useStoryboard } from "./hooks";
import * as Styled from "./style";
export const StoryboardHeader = ({ screen }: { screen: StoryboardScreen }) => {
  const { story } = useStory();
  const { closeBoard, openBoard } = useStoryboard();
  const { user } = useCurrentUser();
  return (
    <Styled.PanelHeader>
      <StoryboardNavigator
        activePanel={screen}
        onPanelChange={(panel) => openBoard(panel)}
        onClose={closeBoard}
        fromTier={user?.subscription?.tier}
        trialing={user?.subscription?.subscriptionStatus === "trialing"}
      />
    </Styled.PanelHeader>
  );
};
