"use client";
import { useStory } from "@/containers/StoryPage";
import { connectProgressSocket } from "@/lib/progress-socket";
import { type DreamThreadData, getDreamThreads } from "@/services/api/story";
import { useCallback, useEffect, useState } from "react";
import * as Style from "./style";

export const DreamThreadsPanel = () => {
  const { storyId } = useStory();
  const [threads, setThreads] = useState<DreamThreadData[]>([]);

  const load = useCallback(async () => {
    const data = await getDreamThreads(storyId);
    setThreads(Array.isArray(data) ? data : []);
  }, [storyId]);

  useEffect(() => {
    void load();

    const socket = connectProgressSocket(storyId, {
      onDreamThreadsUpdated: () => {
        void load();
      },
    });

    return () => {
      socket?.disconnect();
    };
  }, [load, storyId]);

  return (
    <Style.Container>
      <Style.Header>
        <h2>Dream threads</h2>
      </Style.Header>

      {threads.length === 0 ? (
        <Style.Empty>No dream threads generated yet.</Style.Empty>
      ) : (
        <Style.CardList>
          {threads.map((thread) => (
            <Style.Card key={thread.id} $type={thread.type}>
              <p>{thread.body}</p>
            </Style.Card>
          ))}
        </Style.CardList>
      )}
    </Style.Container>
  );
};
