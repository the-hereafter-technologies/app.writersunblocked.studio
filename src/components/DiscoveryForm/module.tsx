"use client";
import { useStory } from "@/containers/StoryPage";
import { useCallback, useMemo } from "react";
import { Button } from "../Button";
import { useDiscovery } from "../DiscoveryProvider";
import * as Style from "./style";

export interface DiscoveryFormProps {
  onChange?: (text: string) => void;
}

/**
 * DiscoveryForm description
 *
 * @param {Object} props - The properties object.
 * @returns {JSX.Element} The rendered DiscoveryForm component.
 */
export const DiscoveryForm = ({ onChange }: DiscoveryFormProps) => {
  const {
    updatePrompt,
    runSimulation,
    includeDreamThreads,
    setIncludeDreamThreads,
  } = useDiscovery();
  const { story, characters } = useStory();

  const isReadOnly = useMemo(() => {
    const status = story?.subscriptionStatus;
    return status === "canceled" || status === "past_due";
  }, [story?.subscriptionStatus]);

  const handleChangeText = useCallback(
    (event: React.FormEvent<HTMLDivElement>) => {
      const text = event.currentTarget.textContent;
      const sanitizedText = text?.trim();
      updatePrompt(sanitizedText);
      onChange?.(sanitizedText);
    },
    [onChange, updatePrompt]
  );

  const handleSubmit = useCallback(async () => {
    if (!story) return;
    // For now, we'll just log the prompt. The actual submission logic will be handled in the parent component.
    await runSimulation({
      storyId: story.id,
      prose: story.content,
      highlightBlockId: null,
      includeDreamThreads,
      hasCharacters: characters.length > 0,
      disabled: isReadOnly,
    });
  }, [
    runSimulation,
    story,
    characters.length,
    includeDreamThreads,
    isReadOnly,
  ]);

  return (
    <Style.Wrapper>
      <Style.Container>
        <Style.Input
          onInput={handleChangeText}
          data-placeholder="What are you trying to figure out in this moment?"
        />
        <Style.Toolbar>
          {/* <Style.ToggleLabel>
            <input
              type="checkbox"
              checked={includeDreamThreads}
              onChange={(event) => setIncludeDreamThreads(event.target.checked)}
            />
            Include Dream Threads
          </Style.ToggleLabel> */}
          <Button
            label="Explore"
            arrow
            disabled={isReadOnly}
            onClick={handleSubmit}
          />
        </Style.Toolbar>
      </Style.Container>
    </Style.Wrapper>
  );
};
