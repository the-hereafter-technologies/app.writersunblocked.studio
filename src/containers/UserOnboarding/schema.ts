import { object, string } from "yup";

export const schema = object({
  handle: string().min(3).required("Handle is required"),
  name: string().min(2).required("Pen name is required"),
});
