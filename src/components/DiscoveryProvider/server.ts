"use server";
import { nestApiRequest } from "@/lib/nest-api";
import { headers } from "next/headers";
import type { StoryDirection } from "./types";

export type GenerateSimulation = {
  storyId: string;
  highlightBlockId: string;
  prompt: string;
  prose: string;
  includeDreamThreads?: boolean;
};

export const simulate = async ({
  storyId,
  highlightBlockId,
  prompt,
  prose,
  includeDreamThreads,
}: GenerateSimulation) => {
  const cookie = (await headers()).get("cookie");
  if (!cookie) {
    throw new Error("No cookie found in request headers");
  }
  const data = await nestApiRequest<{
    directions?: StoryDirection[];
    pecDiscardedCount?: number;
  }>({
    path: "/simulate",
    method: "POST",
    timeoutMs: 45000,
    headers: {
      cookie,
    },
    body: {
      storyId,
      highlightBlockId,
      question: prompt.trim() || prose,
      includeDreamThreads: Boolean(includeDreamThreads),
    },
  });

  return data;
};
