//TEST USERS


import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();


async function main() {
  await prisma.comment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash("password123", 10);

  const admin = await prisma.user.create({
    data: { name: "Ada Admin", email: "admin@bugdash.dev", password, role: "ADMIN" },
  });
  const ben = await prisma.user.create({
    data: { name: "Ben Carter", email: "ben@bugdash.dev", password, role: "DEVELOPER" },
  });
  const cleo = await prisma.user.create({
    data: { name: "Cleo Nguyen", email: "cleo@bugdash.dev", password, role: "DEVELOPER" },
  });
  const dan = await prisma.user.create({
    data: { name: "Dan Ortiz", email: "dan@bugdash.dev", password, role: "DEVELOPER" },
  });

  const webApp = await prisma.project.create({
    data: {
      name: "Web App",
      description: "Customer-facing web application.",
      ownerId: admin.id,
      members: { create: [{ userId: ben.id }, { userId: cleo.id }] },
    },
  });
  const mobileApp = await prisma.project.create({
    data: {
      name: "Mobile App",
      description: "iOS and Android client.",
      ownerId: admin.id,
      members: { create: [{ userId: cleo.id }, { userId: dan.id }] },
    },
  });

  const loginBug = await prisma.issue.create({
    data: {
      title: "Login button unresponsive on Safari",
      description: "Clicking Sign in does nothing on Safari 17. Works in Chrome and Firefox.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: webApp.id,
      reporterId: admin.id,
      assigneeId: ben.id,
      dueDate: new Date("2026-08-01"),
    },
  });

  const crashBug = await prisma.issue.create({
    data: {
      title: "App crashes on cold start (Android 14)",
      description: "Fresh install crashes on first launch on Pixel 8. Stack trace attached.",
      status: "TODO",
      priority: "CRITICAL",
      projectId: mobileApp.id,
      reporterId: cleo.id,
      assigneeId: dan.id,
    },
  });

  await prisma.issue.create({
    data: {
      title: "Dashboard totals off by one",
      description: "Open-issue count shows one more than the actual list.",
      status: "IN_REVIEW",
      priority: "MEDIUM",
      projectId: webApp.id,
      reporterId: ben.id,
      assigneeId: cleo.id,
    },
  });
  await prisma.issue.create({
    data: {
      title: "Add dark mode toggle",
      description: "Users want a dark theme option in settings.",
      status: "BACKLOG",
      priority: "LOW",
      projectId: webApp.id,
      reporterId: admin.id,
    },
  });
  await prisma.issue.create({
    data: {
      title: "Push notifications not delivered on iOS",
      description: "APNs tokens register but no notifications arrive.",
      status: "TODO",
      priority: "HIGH",
      projectId: mobileApp.id,
      reporterId: dan.id,
      assigneeId: cleo.id,
    },
  });
  await prisma.issue.create({
    data: {
      title: "Fix password reset email typo",
      description: "Reset email says 'you're' instead of 'your'.",
      status: "DONE",
      priority: "LOW",
      projectId: webApp.id,
      reporterId: cleo.id,
      assigneeId: ben.id,
    },
  });
  await prisma.issue.create({
    data: {
      title: "Improve list scroll performance",
      description: "Issue list stutters past ~200 rows on mobile.",
      status: "DONE",
      priority: "MEDIUM",
      projectId: mobileApp.id,
      reporterId: admin.id,
      assigneeId: dan.id,
    },
  });

  await prisma.comment.create({
    data: {
      body: "Reproduced on Safari 17.4 — looks like a preventDefault issue.",
      issueId: loginBug.id,
      authorId: ben.id,
    },
  });
  await prisma.comment.create({
    data: {
      body: "Grabbed the crash logs, it's a null map reference on startup.",
      issueId: crashBug.id,
      authorId: dan.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });