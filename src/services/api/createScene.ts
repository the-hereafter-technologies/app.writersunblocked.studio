import { nestApiRequest } from "@/lib/nest-api";

export interface CreateScene {
  title: string;
  order: number;
  shortId: string;
  visible?: boolean;
  color?: string;
}

export interface GetScene {
  id: string;
  name: string;
}

export const createScene = async (
  storyId: string,
  body: CreateScene
): Promise<GetScene> => {
  return nestApiRequest<GetScene>({
    path: `/stories/${storyId}/scenes`,
    method: "POST",
    body,
  });
};
