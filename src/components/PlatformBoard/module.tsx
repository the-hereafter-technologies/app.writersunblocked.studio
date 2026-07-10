"use client";

import { useStory } from "@/containers/StoryPage";
import {
  type PlatformData,
  type PlatformFieldHandle,
  PlatformInput,
  PlatformPostItemList,
  PlatformPostList,
  PlatformType,
} from "@writersunblocked/ui/app";
import { useRef } from "react";
import { PlatformBoardProvider } from "./provider";
import * as Style from "./style";
import { usePlatformBoard } from "./utils";

const PlatformBoardContent = () => {
  const inputRef = useRef<PlatformFieldHandle>(null);
  const {
    posts,
    postItems,
    selectedPostId,
    postsLoading,
    submitting,
    analyzingPostId,
    applyingItemId,
    error,
    actionError,
    selectPost,
    submitPost,
    applyItem,
  } = usePlatformBoard();

  const handleSubmit = async (data?: PlatformData) => {
    const body = data?.plainText?.trim();
    if (!body) {
      return;
    }

    const didSubmit = await submitPost({
      platformType: data?.platformType ?? PlatformType.INPUT,
      body,
      content: data?.content,
      color: data?.color,
    });

    if (didSubmit) {
      inputRef.current?.clear?.();
    }
  };

  return (
    <Style.Container>
      <Style.Column>
        <PlatformInput
          ref={inputRef}
          disabled={submitting}
          onSubmit={(data) => void handleSubmit(data)}
        />
        {error && <Style.Message $variant="error">{error}</Style.Message>}
      </Style.Column>
      <Style.Column>
        <PlatformPostList
          posts={posts}
          selectedPostId={selectedPostId}
          onSelectPost={selectPost}
        />
        {postsLoading && (
          <Style.Message>Loading platform history...</Style.Message>
        )}
        {analyzingPostId && (
          <Style.Message>Analyzing your latest post...</Style.Message>
        )}
      </Style.Column>
      <Style.Column>
        {!selectedPostId && !postsLoading && (
          <Style.Message>Select a post to see its suggestions.</Style.Message>
        )}
        {selectedPostId && postItems.length === 0 && !analyzingPostId && (
          <Style.Message>
            No suggestions yet for this post. Write a bit more and post again.
          </Style.Message>
        )}
        <PlatformPostItemList
          postItems={postItems.map((item) => ({
            ...item,
            onAddToStoryboard:
              !item.accepted && applyingItemId !== item.id
                ? () => void applyItem(item.id)
                : undefined,
          }))}
        />
        {actionError && (
          <Style.Message $variant="error">{actionError}</Style.Message>
        )}
      </Style.Column>
    </Style.Container>
  );
};

export type PlatformBoardProps = {
  storyId?: string;
};

export const PlatformBoard = ({ storyId }: PlatformBoardProps) => {
  const { story } = useStory();
  const resolvedStoryId = storyId ?? story?.id;

  if (!resolvedStoryId) {
    return null;
  }

  return (
    <PlatformBoardProvider storyId={resolvedStoryId}>
      <PlatformBoardContent />
    </PlatformBoardProvider>
  );
};
