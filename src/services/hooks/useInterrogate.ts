import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { interrogateQuery } from "../api/interrogateQuery";

export type InterrogatedItem = {
  question: string;
  answered?: boolean;
  evidence?: string;
};

export type Interrogation = {
  thresholdReached: boolean;
  status: InterrogatedItem[];
  wordCount: number;
};

export type InterrogationDraft = {
  body: string;
  questions: string[];
};

const ANALYSIS_DEBOUNCE_MS = 1000;
const ANALYSIS_MIN_WORDS = 20;

const createEmptyInterrogation = (
  wordCount: number,
  defaultQuestions: string[] = []
): Interrogation => ({
  wordCount,
  status: defaultQuestions.map((v) => ({ question: v, answered: false })),
  thresholdReached: false,
});

const countWords = (value: string): number => {
  const matches = value.trim().match(/\S+/g);
  return matches?.length ?? 0;
};

export const useInterrogate = (
  storyId?: string,
  defaultQuestions: string[] = []
) => {
  const [interrogation, setInterrogation] = useState<Interrogation>(
    createEmptyInterrogation(0)
  );
  const [draft, setDraft] = useState<InterrogationDraft>({
    body: "",
    questions: defaultQuestions,
  });
  const [isWorking, setWorking] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const runRef = useRef(0);
  const isWorkingRef = useRef(isWorking);
  const defaultQuestionsRef = useRef(defaultQuestions);
  const lastSubmittedBodyRef = useRef("");

  useEffect(() => {
    isWorkingRef.current = isWorking;
  }, [isWorking]);

  useEffect(() => {
    defaultQuestionsRef.current = defaultQuestions;
  }, [defaultQuestions]);

  const wordCount = useMemo(() => countWords(draft.body), [draft.body]);

  const handleInterrogateSuccess = useCallback((data: Interrogation) => {
    setInterrogation(data);
    setWorking(false);
  }, []);

  useEffect(() => {
    if (!storyId) return;
    const runId = runRef.current + 1;
    runRef.current = runId;

    if (draft.questions.length <= 0 || draft.body.length <= 0) return;

    setInterrogation((current: Interrogation) => {
      if (wordCount < ANALYSIS_MIN_WORDS) {
        return createEmptyInterrogation(wordCount, defaultQuestionsRef.current);
      }
      return { ...current, wordCount, thresholdReached: false };
    });

    if (wordCount < ANALYSIS_MIN_WORDS) {
      setWorking(false);
      return;
    }

    const handle = window.setTimeout(async () => {
      if (isWorkingRef.current) return;
      try {
        await interrogateQuery(storyId, draft.body, draft.questions);
        if (runRef.current !== runId) return;
        setError(null);
      } catch (caughtError) {
        if (runRef.current !== runId) return;
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to interrogate your draft right now."
        );
      }
      setWorking(false);
    }, ANALYSIS_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(handle);
    };
  }, [draft, wordCount, storyId]);

  const interrogate = useCallback(
    (body: string, questions: string[]) => {
      if (isWorkingRef.current) return;
      if (lastSubmittedBodyRef.current === body) return;
      lastSubmittedBodyRef.current = body;
      setDraft({ body, questions });
    },
    []
  );

  return {
    interrogation,
    interrogate,
    isWorking,
    error,
    draft,
    handleInterrogateSuccess,
  };
};
