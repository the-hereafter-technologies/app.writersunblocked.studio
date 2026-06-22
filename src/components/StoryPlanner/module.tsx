"use client";
import { useStory } from "@/containers/StoryPage";
import { skipStoryOnboarding } from "@/services/api/skipStoryOnboarding";
import type { PlatformActionItem } from "@/services/api/story";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import {
  Accordion,
  AccordionItem,
  PlatformAction,
  PlatformPostItem,
  type PlatformPostField,
  StoryboardStarter,
} from "@writersunblocked/ui/app";
import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  applyPlatformAction,
  canApplyPlatformAction,
  getPlatformActionKey,
} from "./apply-platform-action";
import { PlannerProvider } from "./provider";
import * as Style from "./style";
import { useStoryPlanner } from "./utils";

export type StoryPlannerProps = PropsWithChildren<{
  storyId: string;
  onCompleted: () => Promise<void> | void;
}>;

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

type StoryPlannerLayoutProps = PropsWithChildren<{
  onCompleted: () => Promise<void> | void;
}>;

const StoryPlannerLayout = ({
  children,
  onCompleted,
}: StoryPlannerLayoutProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [acceptedActionKeys, setAcceptedActionKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [addingActionKey, setAddingActionKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  const pendingCompleteRef = useRef(false);
  const skipRequestedRef = useRef(false);
  const sceneOrderRef = useRef(1);

  const { analysis, analysisLoading, error, interrogation, setDraft } =
    useStoryPlanner();
  const { story, refreshAll } = useStory();
  const { user } = useCurrentUser();

  const actions = useMemo<PlatformActionItem[]>(
    () => analysis?.translation?.actions ?? [],
    [analysis?.translation?.actions]
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

  const completeOnboarding = useCallback(async () => {
    if (!story?.id) {
      return;
    }

    await skipStoryOnboarding(story.id);
    await onCompleted();
  }, [onCompleted, story?.id]);

  const handleSkip = useCallback(async () => {
    if (!story?.id) {
      return;
    }

    skipRequestedRef.current = true;
    await completeOnboarding();
  }, [completeOnboarding, story?.id]);

  const handleAddToStoryboard = useCallback(
    async (item: PlatformActionItem) => {
      if (!story?.id) {
        return;
      }

      const actionKey = getPlatformActionKey(item);
      if (acceptedActionKeys.has(actionKey) || addingActionKey === actionKey) {
        return;
      }

      setActionError(null);
      setAddingActionKey(actionKey);

      try {
        const order = sceneOrderRef.current;
        await applyPlatformAction(story.id, item, order);

        if (item.action === PlatformAction.NEW_SCENE) {
          sceneOrderRef.current += 1;
        }

        setAcceptedActionKeys((current) => new Set(current).add(actionKey));
        await refreshAll();
      } catch (caughtError) {
        setActionError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to add this item to your storyboard."
        );
      } finally {
        setAddingActionKey(null);
      }
    },
    [acceptedActionKeys, addingActionKey, refreshAll, story?.id]
  );

  const handleContinue = useCallback(() => {
    pendingCompleteRef.current = true;
    setIsContinuing(true);
    setCurrentPageIndex(2);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    if (!pendingCompleteRef.current) {
      return;
    }

    pendingCompleteRef.current = false;
    void completeOnboarding();
  }, [completeOnboarding]);

  return (
    <Style.Container>
      <Style.Rail
        animate={{
          transform: `translateX(calc(85vw * ${-currentPageIndex}))`,
        }}
        transition={{
          duration: skipRequestedRef.current ? 0 : 0.75,
        }}
        onAnimationComplete={handleAnimationComplete}
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
              <Style.AccordionButton onClick={() => void handleSkip()}>
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
                {actions.map((item) => {
                  if (!item) {
                    return null;
                  }

                  const actionKey = getPlatformActionKey(item);
                  const isAccepted = acceptedActionKeys.has(actionKey);
                  const isAdding = addingActionKey === actionKey;
                  const canApply = canApplyPlatformAction(item.action);

                  return (
                    <PlatformPostItem
                      key={actionKey}
                      action={toPlatformAction(item.action)}
                      body={
                        typeof item.body === "string"
                          ? item.body
                          : String(item.body ?? "")
                      }
                      data={
                        (item.data?.map((field) => ({
                          label: field.label,
                          type: field.type,
                          value: field.value,
                        })) ?? []) as PlatformPostField[]
                      }
                      accepted={isAccepted}
                      onAddToStoryboard={
                        canApply && !isAccepted && !isAdding
                          ? () => void handleAddToStoryboard(item)
                          : undefined
                      }
                    />
                  );
                })}
              </Style.ActionList>
            )}

            {(analysisLoading || error) && error && (
              <Style.ErrorText>{error}</Style.ErrorText>
            )}

            {actionError && <Style.ErrorText>{actionError}</Style.ErrorText>}
          </Style.ExtractBody>

          <Style.Actions>
            <Style.PrimaryButton
              type="button"
              onClick={handleContinue}
              disabled={isContinuing}
              label={isContinuing ? "Continuing..." : "Continue"}
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
export const StoryPlanner = ({
  storyId,
  onCompleted,
  children,
}: StoryPlannerProps) => {
  return (
    <PlannerProvider storyId={storyId} onCompleted={onCompleted}>
      <StoryPlannerLayout onCompleted={onCompleted}>
        {children}
      </StoryPlannerLayout>
    </PlannerProvider>
  );
};
