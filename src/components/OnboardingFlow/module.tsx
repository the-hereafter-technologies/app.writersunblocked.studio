"use client";
import { connectProgressSocket } from "@/lib/progress-socket";
import { type OnboardingAnswers, onboardStory } from "@/services/api/story";
import { useEffect, useMemo, useState } from "react";
import * as Style from "./style";

interface OnboardingFlowProps {
  storyId: string;
  onCompleted: () => Promise<void> | void;
}

type StepConfig = {
  key: keyof OnboardingAnswers;
  title: string;
  options?: string[];
  freeText?: boolean;
};

const steps: StepConfig[] = [
  {
    key: "setting",
    title: "Setting",
    options: [
      "Present-day Earth",
      "Historical Earth",
      "Near-future",
      "Alternate history",
      "Invented world",
    ],
  },
  {
    key: "era",
    title: "Era",
    options: [
      "Ancient",
      "Medieval",
      "Renaissance",
      "Industrial",
      "20th century",
      "Contemporary",
      "Near future",
      "Far future",
    ],
  },
  {
    key: "magicOrTech",
    title: "Magic or tech rules",
    options: [
      "Grounded realism",
      "Magic",
      "Advanced tech",
      "Magic + tech",
      "Supernatural",
      "Other",
    ],
  },
  {
    key: "characters",
    title: "Characters",
    freeText: true,
  },
  {
    key: "relationships",
    title: "Relationships",
    options: [
      "Strangers",
      "Reluctant allies",
      "Old friends",
      "Rivals",
      "Family",
      "Mentor + student",
      "Romantic tension",
    ],
  },
  {
    key: "conflict",
    title: "Central conflict",
    freeText: true,
  },
  {
    key: "plotBeats",
    title: "Known plot beats",
    options: [
      "Not yet",
      "A few",
      "I know the ending",
      "I know the opening",
      "Full outline",
    ],
    freeText: true,
  },
];

const emptyAnswers: OnboardingAnswers = {
  setting: "",
  era: "",
  magicOrTech: "",
  characters: "",
  relationships: "",
  conflict: "",
  plotBeats: "",
};

export const OnboardingFlow = ({
  storyId,
  onCompleted,
}: OnboardingFlowProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(emptyAnswers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = connectProgressSocket(storyId, {
      onOnboardingComplete: () => {
        void onCompleted();
      },
    });

    return () => {
      socket?.disconnect();
    };
  }, [onCompleted, storyId]);

  const step = steps[stepIndex];

  const progressLabel = useMemo(() => {
    return `Step ${stepIndex + 1} of ${steps.length}`;
  }, [stepIndex]);

  const setStepValue = (value: string) => {
    setAnswers((current) => ({
      ...current,
      [step.key]: value,
    }));
  };

  const value = answers[step.key] ?? "";

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await onboardStory(storyId, answers);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to start onboarding generation.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Style.Container>
      <Style.Header>
        <h1>Let&apos;s build your storyboard</h1>
        <p>
          Quick interview first. We will generate characters, locations, world
          canon, and starter plot beats for you.
        </p>
      </Style.Header>

      <Style.Step>
        <Style.Prompt>{step.title}</Style.Prompt>

        {step.options && (
          <Style.Chips>
            {step.options.map((option) => (
              <Style.ChipButton
                key={option}
                type="button"
                $active={value.includes(option)}
                onClick={() => {
                  if (
                    step.freeText &&
                    value.length > 0 &&
                    !value.includes(option)
                  ) {
                    setStepValue(`${option}. ${value}`);
                    return;
                  }

                  setStepValue(option);
                }}
              >
                {option}
              </Style.ChipButton>
            ))}
          </Style.Chips>
        )}

        {step.freeText && (
          <Style.Textarea
            value={value}
            onChange={(event) => setStepValue(event.target.value)}
            placeholder="Write anything you know so far..."
          />
        )}

        <Style.Footer>
          <Style.Progress>{progressLabel}</Style.Progress>
          <Style.Actions>
            {stepIndex > 0 && (
              <Style.GhostButton type="button" onClick={handleBack}>
                Back
              </Style.GhostButton>
            )}
            {stepIndex < steps.length - 1 ? (
              <Style.PrimaryButton type="button" onClick={handleNext}>
                Continue
              </Style.PrimaryButton>
            ) : (
              <Style.PrimaryButton type="button" onClick={handleSubmit}>
                {loading ? "Generating..." : "Generate storyboard"}
              </Style.PrimaryButton>
            )}
          </Style.Actions>
        </Style.Footer>

        {error && <Style.ErrorText>{error}</Style.ErrorText>}
      </Style.Step>
    </Style.Container>
  );
};
