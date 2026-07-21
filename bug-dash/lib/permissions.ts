// Permission helpers used by data functions, server actions, and UI.
// Every rule funnels through here so behavior stays consistent.

import type { SessionUser } from "@/types";

export function isAdmin(user: SessionUser): boolean {
  return user.role.toUpperCase() === "ADMIN";
}

// Admins manage all projects. Developers cannot create/edit/delete projects.
export function canManageProjects(user: SessionUser): boolean {
  return isAdmin(user);
}

// A user can access a project if they are an admin, the owner, or a member.
export function canAccessProject(
  user: SessionUser,
  project: { ownerId: string; members: { userId: string }[] }
): boolean {
  return (
    isAdmin(user) ||
    project.ownerId === user.id ||
    project.members.some((m) => m.userId === user.id)
  );
}

// A user can edit an issue if they are an admin or the assignee.
export function canEditIssue(
  user: SessionUser,
  issue: { assigneeId: string | null }
): boolean {
  return isAdmin(user) || issue.assigneeId === user.id;
}

// Only admins can delete issues.
export function canDeleteIssue(user: SessionUser): boolean {
  return isAdmin(user);
}

// A user can delete a comment if they are an admin or the author.
export function canDeleteComment(
  user: SessionUser,
  comment: { authorId: string }
): boolean {
  return isAdmin(user) || comment.authorId === user.id;
}