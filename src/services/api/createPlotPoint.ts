import { nestApiRequest } from "@/lib/nest-api";

export interface CreatePlotPoint {
  shortId: string;
  sceneId: string;
  body: string;
  status?: "pending" | "confirmed";
  order: number;
}

export interface GetPlotPoint {
  id: string;
  name: string;
}

export const createMention = async (
  storyId: string,
  body: CreatePlotPoint
): Promise<GetPlotPoint> => {
  return nestApiRequest<GetPlotPoint>({
    path: `/storyboard/${storyId}/plot-point`,
    method: "POST",
    body,
  });
};
