"use client";
import { NestApiError } from "@/lib/nest-api";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { simulate } from "./server";
import type { RunSimulationParams, StoryDirection } from "./types";

export interface DiscoveryContextType {
  directions: StoryDirection[];
  pecDiscarded: number;
  selectedIndex: number | null;
  loading: boolean;
  error: string | null;
  hasRun: boolean;
  prompt: string;
  includeDreamThreads: boolean;
  setIncludeDreamThreads: (value: boolean) => void;
  runSimulation: (params: RunSimulationParams) => Promise<void>;
  updatePrompt: (newPrompt: string) => void;
}

export const DiscoveryContext = createContext<DiscoveryContextType | null>(
  null
);

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
};

export interface DiscoveryProviderProps extends PropsWithChildren {}

/**
 * DiscoveryProvider description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered DiscoveryProvider component.
 */
export const DiscoveryProvider = ({ children }: DiscoveryProviderProps) => {
  const [directions, setDirections] = useState<StoryDirection[]>([]);
  const [pecDiscarded, setPecDiscarded] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [includeDreamThreads, setIncludeDreamThreads] = useState(true);

  const updatePrompt = (newPrompt: string) => {
    setPrompt(newPrompt);
  };

  const runSimulation = useCallback(
    async ({
      storyId,
      prose,
      highlightBlockId,
      includeDreamThreads,
      hasCharacters,
      disabled,
    }: RunSimulationParams) => {
      if (disabled || loading) return;

      if (!highlightBlockId) {
        setError(
          "No story block is available for simulation yet. Save or re-analyze the story first."
        );
        return;
      }

      if (!hasCharacters) {
        setError("Create at least one character before running a simulation.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await simulate({
          storyId,
          highlightBlockId: highlightBlockId!,
          prompt: prompt.trim() || prose,
          prose,
          includeDreamThreads,
        });

        setDirections(data.directions ?? []);
        setPecDiscarded(data.pecDiscardedCount ?? 0);
        setSelectedIndex(null);
        setHasRun(true);
      } catch (err) {
        if (err instanceof NestApiError) {
          setError(err.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, prompt]
  );
  return (
    <DiscoveryContext.Provider
      value={{
        directions,
        pecDiscarded,
        selectedIndex,
        loading,
        error,
        hasRun,
        prompt,
        includeDreamThreads,
        setIncludeDreamThreads,
        runSimulation,
        updatePrompt,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
};
