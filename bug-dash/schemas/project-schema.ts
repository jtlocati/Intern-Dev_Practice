//define the schema for projects + make easalu accessable

import { string, z } from "zod";

export const projectSchema = z.object({name: z.string().min(1, "name is required").max(100), description: z.string().min(1, "Description is required").max(1000),memberids: z.array(z.string()).default([])})

export type ProjectInput = z.infer<typeof projectSchema>