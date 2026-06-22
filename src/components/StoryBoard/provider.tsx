"use client";
import { StoryboardScreen } from "@writersunblocked/ui/app";
import { AnimatePresence } from "motion/react";
import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { MentionBoard } from "../MentionBoard";
import { ProjectBoard } from "../ProjectBoard";
import { StoryboardHeader } from "./header";
import * as Style from "./style";
import { StoryboardContext } from "./utils";

export const StoryBoardProvider = ({ children }: PropsWithChildren) => {
  const [screen, setScreen] = useState<StoryboardScreen>(
    StoryboardScreen.Scene
  );
  const [entityId, setEntityId] = useState<string | null>(null);
  const [isStoryboardOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (isStoryboardOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isStoryboardOpen]);

  const openBoard = (screen?: StoryboardScreen, entityId?: string) => {
    setScreen(screen ?? StoryboardScreen.Scene);
    setEntityId(entityId ?? null);
    setIsPanelOpen(true);
    console.log("Opening board:", screen, entityId);
  };

  const closeBoard = () => {
    setEntityId(null);
    setIsPanelOpen(false);
  };

  const currentScreen = useMemo(() => {
    switch (screen) {
      case StoryboardScreen.Story:
        return <ProjectBoard />;
      case StoryboardScreen.Mention:
        return <MentionBoard mentionId={entityId} />;
      case StoryboardScreen.Scene:
        return <div></div>;
      default:
        return null;
    }
  }, [screen, entityId]);

  return (
    <StoryboardContext.Provider
      value={{ screen, openBoard, closeBoard, isStoryboardOpen }}
    >
      {children}
      <AnimatePresence>
        {isStoryboardOpen && (
          <>
            <Style.Scrim />
            <Style.PanelContainer>
              <Style.ScrollWrapper>
                <StoryboardHeader screen={screen} />
                <Style.PanelContent>{currentScreen}</Style.PanelContent>
              </Style.ScrollWrapper>
            </Style.PanelContainer>
          </>
        )}
      </AnimatePresence>
    </StoryboardContext.Provider>
  );
};
