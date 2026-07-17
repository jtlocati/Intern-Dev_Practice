// TODO: Implement comment.ts
//display name + avitar with comment on fronend

import type { Comment } from "@prisma/client";
import type { UserSummary } from "./user";

export type { Comment };

export type CommentWithInfo = Comment & {author: UserSummary;};