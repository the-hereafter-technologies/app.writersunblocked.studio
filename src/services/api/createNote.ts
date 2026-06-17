import { nestApiRequest } from "@/lib/nest-api";

export interface CreateNote {
  body: string;
  NoteId?: number;
  status?: boolean;
  color: string;
}

export interface GetNote {
  id: string;
  name: string;
}

export const createNote = async (
  storyId: string,
  body: CreateNote
): Promise<GetNote> => {
  return nestApiRequest<GetNote>({
    path: `/storyboard/${storyId}/note`,
    method: "POST",
    body,
  });
};
