"use client";
import { useStory } from "@/containers/StoryPage";
import { getWorldCanon, patchWorldCanon } from "@/services/api/story";
import { useEffect, useMemo, useState } from "react";
import * as Style from "./style";

type CanonRules = Record<string, unknown>;

const baseKeys = ["era", "magic", "socialStructure", "tone", "setting"];

export const WorldCanonPanel = () => {
  const { storyId } = useStory();
  const [rules, setRules] = useState<CanonRules>({});
  const [pendingPatch, setPendingPatch] = useState<CanonRules | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const canon = await getWorldCanon(storyId);
      if (!cancelled) {
        setRules((canon.rules as CanonRules) ?? {});
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [storyId]);

  useEffect(() => {
    if (!pendingPatch) {
      return;
    }

    const timer = setTimeout(() => {
      void patchWorldCanon(storyId, pendingPatch);
    }, 800);

    return () => clearTimeout(timer);
  }, [pendingPatch, storyId]);

  const flatRules = useMemo(() => {
    const custom =
      rules.custom && typeof rules.custom === "object"
        ? (rules.custom as Record<string, string>)
        : {};

    const normal: Array<{ key: string; value: string }> = [];
    for (const [key, value] of Object.entries(rules)) {
      if (key === "custom") continue;
      normal.push({ key, value: String(value ?? "") });
    }

    for (const key of baseKeys) {
      if (!normal.some((entry) => entry.key === key)) {
        normal.push({ key, value: "" });
      }
    }

    const customEntries = Object.entries(custom).map(([key, value]) => ({
      key: `custom.${key}`,
      value: String(value ?? ""),
    }));

    return [...normal, ...customEntries];
  }, [rules]);

  const handleRuleChange = (key: string, value: string) => {
    if (key.startsWith("custom.")) {
      const customKey = key.replace("custom.", "");
      const nextCustom = {
        ...(rules.custom && typeof rules.custom === "object"
          ? (rules.custom as Record<string, string>)
          : {}),
        [customKey]: value,
      };

      const nextRules = { ...rules, custom: nextCustom };
      setRules(nextRules);
      setPendingPatch({ custom: nextCustom });
      return;
    }

    const nextRules = { ...rules, [key]: value };
    setRules(nextRules);
    setPendingPatch({ [key]: value });
  };

  const handleAddRule = () => {
    const cleanKey = newKey.trim();
    if (!cleanKey) {
      return;
    }

    const nextCustom = {
      ...(rules.custom && typeof rules.custom === "object"
        ? (rules.custom as Record<string, string>)
        : {}),
      [cleanKey]: newValue,
    };

    setRules((current) => ({ ...current, custom: nextCustom }));
    setPendingPatch({ custom: nextCustom });
    setNewKey("");
    setNewValue("");
  };

  return (
    <Style.Container>
      <Style.Header>
        <h2>World canon</h2>
        <p>Directly define world rules for this story.</p>
      </Style.Header>

      <Style.FieldList>
        {flatRules.map((entry) => (
          <Style.Field key={entry.key}>
            <span>{entry.key}</span>
            <input
              value={entry.value}
              onChange={(event) =>
                handleRuleChange(entry.key, event.target.value)
              }
            />
          </Style.Field>
        ))}
      </Style.FieldList>

      <Style.AddRuleRow>
        <input
          value={newKey}
          onChange={(event) => setNewKey(event.target.value)}
          placeholder="custom rule key"
        />
        <input
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
          placeholder="custom rule value"
        />
        <button type="button" onClick={handleAddRule}>
          + Add rule
        </button>
      </Style.AddRuleRow>

      <Style.Hint>Edits auto-save after a short pause.</Style.Hint>
    </Style.Container>
  );
};
