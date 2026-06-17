import { nestApiRequest } from "@/lib/nest-api";

export interface DeletedStory {
  status: "ok" | "error";
}

export const deleteStory = async (storyId: string): Promise<DeletedStory> => {
  return nestApiRequest<DeletedStory>({
    path: `/stories/${storyId}`,
    method: "DELETE",
    cache: "no-store",
  });
};
