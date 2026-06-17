"use client";
import { useStory } from "@/containers/StoryPage";
import type { PlatformActionItem } from "@/services/api/story";
import { skipStoryOnboarding } from "@/services/api/skipStoryOnboarding";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import {
  Accordion,
  AccordionItem,
  PlatformPostItem,
  PlatformAction,
  StoryboardStarter,
} from "@writersunblocked/ui";
import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { PlannerProvider } from "./provider";
import * as Style from "./style";
import { useStoryPlanner } from "./utils";

export type StoryPlannerProps = {
  storyId: string;
  onCompleted: () => Promise<void> | void;
};

const toPlatformAction = (action: string): PlatformAction => {
  switch (action) {
    case PlatformAction.NEW_MENTION:
    case PlatformAction.UPDATE_MENTION:
    case PlatformAction.NEW_SCENE:
    case PlatformAction.UPDATE_SCENE:
    case PlatformAction.NEW_NOTE:
    case PlatformAction.UPDATE_NOTE:
      return action;
    default:
      return PlatformAction.NEW_NOTE;
  }
};

const StoryPlannerLayout = ({ children }: PropsWithChildren) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const {
    analysis,
    analysisLoading,
    submitting,
    awaitingCompletion,
    error,
    canGenerate,
    interrogation,
    setDraft,
    generateStoryboard,
  } = useStoryPlanner();
  const { story } = useStory();
  const { user } = useCurrentUser();

  const actions = useMemo<PlatformActionItem[]>(
    () => analysis?.translation?.actions ?? [],
    [analysis?.translation?.actions],
  );

  const questions = useMemo(() => {
    if (interrogation.status.length === 0) {
      return [
        { question: "Who is at the center of this story?" },
        { question: "Where does the story take place?" },
        { question: "What happens that changes everything?" },
        { question: "What does your protagonist want or need?" },
        { question: "What stands in the way?" },
      ];
    }

    return interrogation.status;
  }, [interrogation]);

  const thinkRef = useRef(null);

  const handleSkip = useCallback(async () => {
    if (!story?.id) return;
    await skipStoryOnboarding(story?.id);
  }, [story]);

  const handleGenerate = () => {
    void generateStoryboard();
  };

  return (
    <Style.Container>
      <Style.Rail
        animate={{
          transform: `translateX(calc(66vw * ${-currentPageIndex}))`,
        }}
        transition={{
          duration: 0.75,
        }}
      >
        <Style.Think>
          <Accordion style={{ height: "100%", gap: 40 }}>
            <AccordionItem
              ref={thinkRef}
              defaultOpen={true}
              style={{ flex: 1 }}
            >
              <StoryboardStarter
                style={{ height: "100%", maxWidth: 740, margin: "0 auto" }}
                interrogation={questions}
                onChange={(data) =>
                  data?.plainText && setDraft(data?.plainText)
                }
                onSubmit={() => setCurrentPageIndex(1)}
              />
            </AccordionItem>
            <AccordionItem ref={thinkRef} defaultOpen={true}>
              <Style.AccordionButton onClick={handleSkip}>
                Skip onboarding and just start writing
              </Style.AccordionButton>
            </AccordionItem>
          </Accordion>
        </Style.Think>
        <Style.Extract>
          <Style.ExtractHeader>
            <h1 contentEditable suppressContentEditableWarning>
              {story?.title}
            </h1>
            <h2>
              by{" "}
              <span contentEditable suppressContentEditableWarning>
                {story?.penName ?? user?.name}
              </span>
            </h2>
          </Style.ExtractHeader>

          <Style.ExtractBody>
            {analysisLoading && (
              <Style.EmptyState>Analyzing your note...</Style.EmptyState>
            )}

            {!analysisLoading && actions.length === 0 && (
              <Style.EmptyState>
                Write a bit more in the previous step and we&apos;ll extract
                mentions, scenes, and notes you can add to your storyboard.
              </Style.EmptyState>
            )}

            {!analysisLoading && actions.length > 0 && (
              <Style.ActionList>
                {actions.map((item) => (
                  <PlatformPostItem
                    key={`${item.action}-${item.body.slice(0, 48)}-${item.data.find((field) => field.label.startsWith("#"))?.value ?? ""}`}
                    action={toPlatformAction(item.action)}
                    body={item.body}
                    data={item.data.map((field) => ({
                      label: field.label,
                      type: field.type,
                      value: field.value,
                    }))}
                  />
                ))}
              </Style.ActionList>
            )}

            {(analysisLoading || error) && error && (
              <Style.ErrorText>{error}</Style.ErrorText>
            )}
          </Style.ExtractBody>

          <Style.Actions>
            <Style.PrimaryButton
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate || actions.length === 0}
              label={
                awaitingCompletion
                  ? "Generating storyboard..."
                  : submitting
                    ? "Starting..."
                    : interrogation.thresholdReached
                      ? "Generate storyboard"
                      : `Answer at least 3 questions (${analysis.answeredCount}/3)`
              }
            />
          </Style.Actions>
        </Style.Extract>
        <Style.Write>{children}</Style.Write>
      </Style.Rail>
    </Style.Container>
  );
};

/**
 * StoryPlanner description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered StoryPlanner component.
 */
export const StoryPlanner = ({ storyId, onCompleted }: StoryPlannerProps) => {
  return (
    <PlannerProvider storyId={storyId} onCompleted={onCompleted}>
      <StoryPlannerLayout />
    </PlannerProvider>
  );
};
