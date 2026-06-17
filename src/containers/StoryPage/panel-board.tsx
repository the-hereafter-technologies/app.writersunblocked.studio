"use client";
import { Button } from "@/components/Button";
import { useStoryboard } from "@/components/StoryBoard/hooks";
import { MentionItem } from "./mention-item";
import { useObserver } from "./observer";
import { SceneItem } from "./scene-item";
import * as Style from "./style";

export const BoardPanel = () => {
  const { openBoard } = useStoryboard();
  const { visibleItems = [] } = useObserver();
  return (
    <Style.BoardPanelContainer>
      <Style.BoardPanelHeader>
        {/* <h2>From your storyboard</h2> */}
      </Style.BoardPanelHeader>
      <Style.BoardPanelCardList>
        {visibleItems.map((item) => (
          <Style.BoardPanelCard key={item.id}>
            {item.type === "mention" && item.mentionType === "person" && (
              <MentionItem mentionId={item.id} />
            )}
            {item.type === "scene" && <SceneItem scene={item.scene} />}
          </Style.BoardPanelCard>
        ))}
      </Style.BoardPanelCardList>
      <Style.BoardPanelToolbar>
        <Button label="open storyboard" onClick={() => openBoard()} />
      </Style.BoardPanelToolbar>
    </Style.BoardPanelContainer>
  );
};
