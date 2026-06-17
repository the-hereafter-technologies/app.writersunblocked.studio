import { nestApiRequest } from "@/lib/nest-api";

export type StoryMode = "novel" | "screenplay";

export interface CreateProjectInput {
  title?: string;
  mode?: StoryMode;
  genre?: string;
  audience?: string;
  isSeries?: boolean;
  penName?: string;
}

export interface Project {
  id: string;
  title: string;
}

export const createProject = async (
  input: CreateProjectInput
): Promise<Project> => {
  return nestApiRequest<Project>({
    path: "/stories",
    method: "POST",
    body: input,
  });
};
