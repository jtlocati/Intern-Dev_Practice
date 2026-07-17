import { z } from "zod";

export const commentSchema = z.object({body: z.string().min(1, "must include content").max(300)});

export type CommentInput = z.infer<typeof commentSchema>
