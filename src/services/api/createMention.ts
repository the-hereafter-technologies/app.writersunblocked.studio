import { nestApiRequest } from "@/lib/nest-api";

export type MentionType = "person" | "place" | "thing";

export interface CreateMention {
  name: string;
  mentionType: MentionType;
  status: "pending" | "confirmed";
  color?: string;
}

export interface GetMention {
  id: string;
  name: string;
}

export const createMention = async (
  storyId: string,
  body: CreateMention
): Promise<GetMention> => {
  return nestApiRequest<GetMention>({
    path: `/storyboard/${storyId}/mention`,
    method: "POST",
    body,
  });
};
