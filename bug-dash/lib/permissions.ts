//check permissions shortcuts
//NOTE: only admin can manage projects + can delete an issue
import type { SessionUser } from "@/types";
import { isAscii } from "buffer";
import { use } from "react";

export function isAdmin(user: SessionUser): boolean {
    return user.role.toUpperCase() === "ADMIN";
}

export function canAccessPage(user: SessionUser, Project: {ownerId: string, memberIds: string[]}): boolean {
    return isAdmin(user) || Project.ownerId === user.id || Project.memberIds.includes(user.id);
}

export function canEditIssue (user: SessionUser, Issue: {assignid: string | null}): boolean {
    return isAdmin(user) || Issue.assignid === user.id
}

export function canDeleteComment(user: SessionUser, comment: {authorid: string}): boolean{
    return isAdmin(user) || comment.authorid === user.id
}
