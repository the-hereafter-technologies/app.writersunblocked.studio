export interface StoryDirection {
  id: string;
  type: string;
  title: string;
  text: string;
  drives: string[];
  momentumScore: number;
  pecNote?: string;
}

export interface RunSimulationParams {
  storyId: string;
  prose: string;
  highlightBlockId?: string | null;
  includeDreamThreads?: boolean;
  hasCharacters?: boolean;
  disabled?: boolean;
  embedded?: boolean;
}
