import { boolean, type InferType, object, string } from "yup";

export const schema = object().shape({
  userId: string().required(
    "There was a problem verifying your account. Please return to the login page and try again."
  ),
  title: string().optional(),
  genre: string()
    .oneOf([
      "fantasy",
      "sci-fi",
      "mystery",
      "romance",
      "historical-fiction",
      "literary-fiction",
      "other",
    ])
    .optional(),
  mode: string().oneOf(["novel", "screenplay"]).optional(),
  projectType: string().oneOf(["novel", "series", "undecided"]).optional(),
  audience: string()
    .oneOf(["under-12", "8-12", "13-18", "19-25", "26+"])
    .optional(),
  isSeries: boolean().optional(),
  penName: string().optional(),
  offerId: string().optional().nullable(),
});

export type StoryOnboardingFormValues = InferType<typeof schema>;
