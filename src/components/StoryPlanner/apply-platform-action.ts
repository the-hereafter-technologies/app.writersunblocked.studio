import {
  createMention,
  createScene,
  type ApiScene,
} from "@/services/api/story";
import type { PlatformActionItem } from "@/services/api/story";
import { PlatformAction } from "@writersunblocked/ui/app";
import { createNote } from "@/services/api/createNote";

const fieldValue = (
  data: PlatformActionItem["data"],
  label: string
): string | undefined => {
  const value = data.find((field) => field.label === label)?.value;
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value);
};

const toMentionType = (
  value?: string
): "person" | "place" | "thing" => {
  if (value === "place" || value === "thing") {
    return value;
  }

  return "person";
};

const toText = (value: unknown): string => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
};

export const getPlatformActionKey = (item: PlatformActionItem): string => {
  const identifier =
    fieldValue(item.data, "#StoryLabel") ??
    fieldValue(item.data, "Summary") ??
    fieldValue(item.data, "Body") ??
    toText(item.body).slice(0, 48);

  return `${item.action}-${identifier}`;
};

export const canApplyPlatformAction = (action: string): boolean => {
  return (
    action === PlatformAction.NEW_MENTION ||
    action === PlatformAction.NEW_SCENE ||
    action === PlatformAction.NEW_NOTE
  );
};

export type ApplyPlatformActionResult = {
  scene?: ApiScene;
};

export const applyPlatformAction = async (
  storyId: string,
  item: PlatformActionItem,
  order: number
): Promise<ApplyPlatformActionResult> => {
  switch (item.action) {
    case PlatformAction.NEW_MENTION: {
      const name = fieldValue(item.data, "#StoryLabel");
      if (!name) {
        throw new Error("Missing mention name.");
      }

      await createMention(storyId, {
        name,
        mentionType: toMentionType(fieldValue(item.data, "#MentionType")),
        status: "confirmed",
        color: "mist",
      });
      return {};
    }
    case PlatformAction.NEW_SCENE: {
      const title =
        fieldValue(item.data, "Summary") ??
        (toText(item.body).trim() || "Untitled Scene");

      const scene = await createScene(storyId, {
        title,
        order,
        visible: true,
      });
      return { scene };
    }
    case PlatformAction.NEW_NOTE: {
      const body = fieldValue(item.data, "Body") ?? toText(item.body).trim();
      if (!body) {
        throw new Error("Missing note body.");
      }

      await createNote(storyId, {
        body,
        color: "amber",
      });
      return {};
    }
    default:
      throw new Error(`Unsupported platform action: ${item.action}`);
  }
};
