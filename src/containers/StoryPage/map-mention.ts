import type {
  CreateMentionPayload,
  MentionType as ApiMentionType,
} from "@/services/api/story";
import type { StoryMention } from "@writersunblocked/ui";

export type ApiMention = {
  id: string;
  name: string;
  mentionType: ApiMentionType | "group";
  color?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const mapApiMentionToStoryMention = (
  mention: ApiMention
): StoryMention => ({
  id: mention.id,
  label: mention.name,
  type: mention.mentionType,
  color: (mention.color ?? undefined) as StoryMention["color"],
  createdAt: mention.createdAt,
  updatedAt: mention.updatedAt,
});

export const mapStoryMentionToCreatePayload = (
  draft: Partial<StoryMention>
): CreateMentionPayload => ({
  name: draft.label ?? "Untitled",
  mentionType: draft.type,
  status: "confirmed",
  color: draft.color,
});
