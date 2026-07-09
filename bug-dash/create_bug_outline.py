from pathlib import Path

# Root folder where the script is located
BASE_DIR = Path(r"C:\Users\jetlo\onedrive\documents\github\intern-dev_Practice")

# Next.js app folder to create
APP_DIR = BASE_DIR / "bug-dash"

directories = [
    # app routes
    "app/(auth)/login",
    "app/(dashboard)/dashboard",
    "app/(dashboard)/projects/new",
    "app/(dashboard)/projects/[projectId]/edit",
    "app/(dashboard)/issues/new",
    "app/(dashboard)/issues/[issueId]/edit",
    "app/(dashboard)/users",
    "app/(dashboard)/settings",
    "app/api/auth/[...nextauth]",
    "app/api/projects/[projectId]",
    "app/api/issues/[issueId]",
    "app/api/comments/[commentId]",
    "app/api/dashboard",
    "app/unauthorized",

    # components
    "components/layout",
    "components/ui",
    "components/projects",
    "components/issues",
    "components/comments",
    "components/shared",

    # backend/app logic
    "actions",
    "data",
    "lib",
    "schemas",
    "types",
    "prisma",
    "public",
    "postman",
]

files = [
    # root app files
    "app/error.tsx",
    "app/loading.tsx",
    "app/not-found.tsx",
    "app/globals.css",
    "app/layout.tsx",
    "app/page.tsx",

    # auth
    "app/(auth)/login/page.tsx",
    "app/(auth)/login/login-form.tsx",

    # dashboard group
    "app/(dashboard)/layout.tsx",

    # dashboard page
    "app/(dashboard)/dashboard/page.tsx",
    "app/(dashboard)/dashboard/dashboard-cards.tsx",
    "app/(dashboard)/dashboard/dashboard-loading.tsx",

    # projects
    "app/(dashboard)/projects/page.tsx",
    "app/(dashboard)/projects/project-list.tsx",
    "app/(dashboard)/projects/project-card.tsx",
    "app/(dashboard)/projects/new/page.tsx",
    "app/(dashboard)/projects/new/new-project-form.tsx",
    "app/(dashboard)/projects/[projectId]/page.tsx",
    "app/(dashboard)/projects/[projectId]/project-header.tsx",
    "app/(dashboard)/projects/[projectId]/project-members.tsx",
    "app/(dashboard)/projects/[projectId]/project-issues.tsx",
    "app/(dashboard)/projects/[projectId]/edit/page.tsx",
    "app/(dashboard)/projects/[projectId]/edit/edit-project-form.tsx",

    # issues
    "app/(dashboard)/issues/page.tsx",
    "app/(dashboard)/issues/issue-table.tsx",
    "app/(dashboard)/issues/issue-filters.tsx",
    "app/(dashboard)/issues/new/page.tsx",
    "app/(dashboard)/issues/new/new-issue-form.tsx",
    "app/(dashboard)/issues/[issueId]/page.tsx",
    "app/(dashboard)/issues/[issueId]/issue-header.tsx",
    "app/(dashboard)/issues/[issueId]/issue-details.tsx",
    "app/(dashboard)/issues/[issueId]/issue-comments.tsx",
    "app/(dashboard)/issues/[issueId]/add-comment-form.tsx",
    "app/(dashboard)/issues/[issueId]/edit/page.tsx",
    "app/(dashboard)/issues/[issueId]/edit/edit-issue-form.tsx",

    # users/settings
    "app/(dashboard)/users/page.tsx",
    "app/(dashboard)/users/users-table.tsx",
    "app/(dashboard)/settings/page.tsx",

    # api routes
    "app/api/auth/[...nextauth]/route.ts",
    "app/api/projects/route.ts",
    "app/api/projects/[projectId]/route.ts",
    "app/api/issues/route.ts",
    "app/api/issues/[issueId]/route.ts",
    "app/api/comments/route.ts",
    "app/api/comments/[commentId]/route.ts",
    "app/api/dashboard/route.ts",

    # unauthorized
    "app/unauthorized/page.tsx",

    # layout components
    "components/layout/app-sidebar.tsx",
    "components/layout/app-navbar.tsx",
    "components/layout/mobile-nav.tsx",
    "components/layout/user-menu.tsx",
    "components/layout/page-header.tsx",

    # ui components
    "components/ui/button.tsx",
    "components/ui/input.tsx",
    "components/ui/textarea.tsx",
    "components/ui/select.tsx",
    "components/ui/badge.tsx",
    "components/ui/card.tsx",
    "components/ui/table.tsx",
    "components/ui/modal.tsx",
    "components/ui/alert.tsx",
    "components/ui/skeleton.tsx",
    "components/ui/empty-state.tsx",

    # project components
    "components/projects/project-form.tsx",
    "components/projects/project-delete-button.tsx",
    "components/projects/project-members-list.tsx",

    # issue components
    "components/issues/issue-form.tsx",
    "components/issues/issue-card.tsx",
    "components/issues/issue-status-badge.tsx",
    "components/issues/issue-priority-badge.tsx",
    "components/issues/issue-delete-button.tsx",
    "components/issues/assignee-select.tsx",

    # comment components
    "components/comments/comment-form.tsx",
    "components/comments/comment-list.tsx",
    "components/comments/comment-card.tsx",
    "components/comments/comment-delete-button.tsx",

    # shared components
    "components/shared/loading-spinner.tsx",
    "components/shared/search-input.tsx",
    "components/shared/confirm-dialog.tsx",
    "components/shared/pagination.tsx",

    # actions
    "actions/auth-actions.ts",
    "actions/project-actions.ts",
    "actions/issue-actions.ts",
    "actions/comment-actions.ts",
    "actions/user-actions.ts",
    "actions/dashboard-actions.ts",

    # data
    "data/projects.ts",
    "data/issues.ts",
    "data/comments.ts",
    "data/users.ts",
    "data/dashboard.ts",

    # lib
    "lib/auth.ts",
    "lib/prisma.ts",
    "lib/permissions.ts",
    "lib/validations.ts",
    "lib/constants.ts",
    "lib/session.ts",
    "lib/utils.ts",

    # schemas
    "schemas/auth-schema.ts",
    "schemas/project-schema.ts",
    "schemas/issue-schema.ts",
    "schemas/comment-schema.ts",

    # types
    "types/auth.ts",
    "types/project.ts",
    "types/issue.ts",
    "types/comment.ts",
    "types/user.ts",
    "types/index.ts",

    # prisma
    "prisma/schema.prisma",
    "prisma/seed.ts",

    # public
    "public/logo.svg",
    "public/placeholder-avatar.png",

    # postman
    "postman/bug-tracker.postman_collection.json",

    # root config files
    "middleware.ts",
    ".env.example",
    ".gitignore",
    "eslint.config.mjs",
    "next.config.ts",
    "package.json",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json",
    "README.md",
]


file_contents = {
    "README.md": """# Bug Dash

Intern benchmark project: a full-stack bug tracker / issue management app built with Next.js.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- Zod
- NextAuth/Auth.js
- Postman for local testing

## Core Features

- Authentication
- Dashboard
- Projects
- Issues
- Comments
- Filtering/search
- Role-based access control
- Responsive UI
""",

    ".env.example": """DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace-this-with-a-secret"
NEXTAUTH_URL="http://localhost:3000"
""",

    ".gitignore": """node_modules
.next
.env
.env.local
dist
build
coverage
.DS_Store
*.log
""",

    "package.json": """{
  "name": "bug-dash",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@auth/prisma-adapter": "latest",
    "@prisma/client": "latest",
    "bcryptjs": "latest",
    "next": "latest",
    "next-auth": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@types/bcryptjs": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "postcss": "latest",
    "prisma": "latest",
    "tailwindcss": "latest",
    "tsx": "latest",
    "typescript": "latest"
  }
}
""",

    "next.config.ts": """import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
""",

    "postcss.config.mjs": """const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
""",

    "tailwind.config.ts": """import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
""",

    "tsconfig.json": """{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
""",

    "eslint.config.mjs": """import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
""",

    "app/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  min-height: 100%;
}
""",

    "app/layout.tsx": """import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bug Dash",
  description: "Intern benchmark bug tracker app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
""",

    "app/page.tsx": """import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
""",

    "app/(dashboard)/layout.tsx": """import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppNavbar } from "@/components/layout/app-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
""",

    "middleware.ts": """export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*", "/issues/:path*", "/users/:path*", "/settings/:path*"],
};
""",

    "lib/prisma.ts": """import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
""",

    "lib/constants.ts": """export const ISSUE_STATUSES = [
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const;

export const ISSUE_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export const USER_ROLES = ["ADMIN", "DEVELOPER"] as const;
""",

    "prisma/schema.prisma": """generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  DEVELOPER
}

enum IssueStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum IssuePriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(DEVELOPER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  ownedProjects Project[]       @relation("ProjectOwner")
  memberships   ProjectMember[]
  reportedIssues Issue[]        @relation("IssueReporter")
  assignedIssues Issue[]        @relation("IssueAssignee")
  comments      Comment[]
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner   User            @relation("ProjectOwner", fields: [ownerId], references: [id])
  members ProjectMember[]
  issues  Issue[]
}

model ProjectMember {
  id        String   @id @default(cuid())
  userId    String
  projectId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  project Project @relation(fields: [projectId], references: [id])

  @@unique([userId, projectId])
}

model Issue {
  id          String        @id @default(cuid())
  title       String
  description String
  status      IssueStatus   @default(BACKLOG)
  priority    IssuePriority @default(MEDIUM)
  projectId   String
  reporterId  String
  assigneeId  String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  dueDate     DateTime?

  project  Project   @relation(fields: [projectId], references: [id])
  reporter User      @relation("IssueReporter", fields: [reporterId], references: [id])
  assignee User?     @relation("IssueAssignee", fields: [assigneeId], references: [id])
  comments Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  body      String
  issueId   String
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  issue  Issue @relation(fields: [issueId], references: [id])
  author User  @relation(fields: [authorId], references: [id])
}
""",
}


def default_tsx_content(component_name: str) -> str:
    return f"""export default function {component_name}() {{
  return (
    <div>
      <h1>{component_name}</h1>
    </div>
  );
}}
"""


def default_ts_content(file_name: str) -> str:
    return f"""// TODO: Implement {file_name}
"""


def component_name_from_path(path: str) -> str:
    raw_name = Path(path).stem

    if raw_name in {"page", "layout", "loading", "error", "not-found", "route"}:
        parent_name = Path(path).parent.name
        raw_name = parent_name.replace("[", "").replace("]", "")

    parts = raw_name.replace("-", " ").replace("_", " ").split()
    name = "".join(part.capitalize() for part in parts)

    if not name:
        name = "Component"

    if name[0].isdigit():
        name = f"Component{name}"

    return name


def get_content_for_file(relative_path: str) -> str:
    if relative_path in file_contents:
        return file_contents[relative_path]

    suffix = Path(relative_path).suffix

    if suffix == ".tsx":
        component_name = component_name_from_path(relative_path)
        return default_tsx_content(component_name)

    if suffix == ".ts":
        return default_ts_content(Path(relative_path).name)

    if suffix == ".mjs":
        return ""

    if suffix == ".json":
        return "{}\n"

    if suffix == ".svg":
        return """<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="24" />
  <text x="60" y="68" text-anchor="middle" font-size="28" fill="white">BD</text>
</svg>
"""

    if suffix == ".png":
        return ""

    return ""


def create_structure() -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)

    for directory in directories:
        path = APP_DIR / directory
        path.mkdir(parents=True, exist_ok=True)

    for file in files:
        path = APP_DIR / file
        path.parent.mkdir(parents=True, exist_ok=True)

        if path.exists():
            print(f"Skipped existing file: {path}")
            continue

        content = get_content_for_file(file)

        if path.suffix == ".png":
            path.touch()
        else:
            path.write_text(content, encoding="utf-8")

        print(f"Created file: {path}")

    print("\nDone.")
    print(f"Project structure created at: {APP_DIR}")


if __name__ == "__main__":
    create_structure()