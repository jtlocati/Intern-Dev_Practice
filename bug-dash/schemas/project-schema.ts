// define the schema for projects — used for form validation on create + edit

import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  memberIds: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;