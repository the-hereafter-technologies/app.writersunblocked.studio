import type { MentionOrganizerValue } from "@writersunblocked/ui/app";

export type { MentionOrganizerValue };

export const EMPTY_MENTION_ORGANIZER_VALUE: MentionOrganizerValue = {
  childrenByGroupId: {},
};

export const parseMentionOrganizerValue = (
  metadata: Record<string, unknown> | null | undefined
): MentionOrganizerValue | undefined => {
  const organizer = metadata?.mentionOrganizer;

  if (
    !organizer ||
    typeof organizer !== "object" ||
    !("childrenByGroupId" in organizer)
  ) {
    return undefined;
  }

  return organizer as MentionOrganizerValue;
};

export const buildMentionOrganizerMetadata = (
  currentMetadata: Record<string, unknown> | null | undefined,
  mentionOrganizer: MentionOrganizerValue
) => ({
  ...(currentMetadata ?? {}),
  mentionOrganizer,
});

export const remapGroupId = (
  value: MentionOrganizerValue,
  fromId: string,
  toId: string
): MentionOrganizerValue => {
  if (fromId === toId || !value.childrenByGroupId[fromId]) {
    return value;
  }

  const { [fromId]: childIds, ...rest } = value.childrenByGroupId;

  return {
    childrenByGroupId: {
      ...rest,
      [toId]: childIds,
    },
  };
};

export const removeGroupFromOrganizer = (
  value: MentionOrganizerValue,
  groupId: string
): MentionOrganizerValue => {
  const { [groupId]: _, ...childrenByGroupId } = value.childrenByGroupId;

  return { childrenByGroupId };
};
