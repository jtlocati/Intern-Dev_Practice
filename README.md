Intern Benchmark Project: Bug Tracker / Issue Management App 

# Bug Tracker — Intern Task Guide

Product spec lives in `README.md` — that's the source of truth for *what* the app
should do. This doc is the *how* and *in what order*.

---

## 1. What's already built (do NOT rebuild these)

- **Auth** — email/password login, sessions, route protection.
  `lib/auth.ts`, `lib/session.ts`, `middleware.ts`, `app/(auth)/login/*`,
  and the dashboard gate in `app/(dashboard)/layout.tsx`.
- **Permissions** — role/ownership rules. `lib/permissions.ts`.
- **Database schema** — User, Project, ProjectMember, Issue, Comment.
  `prisma/schema.prisma`, client at `lib/prisma.ts`.
- **Seed data** — an admin, three developers, two projects, issues, comments.
  `prisma/seed.ts`.
- **Shared contracts** — the TypeScript types and Zod schemas both teams build
  against: `types/*`, `schemas/*`, `lib/validations.ts`, `lib/utils.ts`,
  `lib/constants.ts`.

If a task feels like it needs one of the above, it already exists — import it.

---

## 2. Getting started

Run these once, from the `bug-dash` folder:

    cp .env.example .env          # then fill in values if needed
    npm install
    docker compose up -d          # starts MySQL; wait ~20s on first boot
    npx prisma db push            # creates tables from the schema
    npx tsx prisma/seed.ts        # loads seed data
    npm run dev                   # http://localhost:3000

Test logins (all password: `password123`):

- Admin:     admin@bugdash.dev
- Developer: ben@bugdash.dev  /  cleo@bugdash.dev  /  dan@bugdash.dev

Re-running the seed wipes and reloads the database — handy when you want a clean
slate. Keep `npx tsc --noEmit` green as you work.

---

## 3. The contracts — build against these, don't invent your own

**Data shapes** (what the backend returns / frontend renders) — in `types/`:
- `IssueWithRelations`, `ProjectWithRelations`, `CommentWithAuthor`
- `IssueFilters` (the filter/search object), `DashboardStats`
- `SafeUser` / `UserSummary` (a user WITHOUT the password field)

**Input shapes** (what forms send / actions validate) — in `schemas/`:
- `projectSchema` → `ProjectInput`
- `issueSchema` → `IssueInput`
- `commentSchema` → `CommentInput`

**Every server action returns `ActionResult<T>`** (from `types/`):
- Success: `{ ok: true, data }`
- Failure: `{ ok: false, error, fieldErrors? }`
- Turn Zod errors into `fieldErrors` with `zodFieldErrors()` from `lib/validations.ts`.

**Auth & permission helpers**:
- `getCurrentUser()`, `requireUser()`, `requireAdmin()` — from `lib/session.ts`
- `isAdmin`, `canAccessProject`, `canManageProjects`, `canEditIssue`,
  `canDeleteIssue`, `canDeleteComment` — from `lib/permissions.ts`

**Utilities** — from `lib/utils.ts`: `cn`, `formatDate`, `formatDateTime`,
`formatRelativeTime`, `formatLabel` (e.g. IN_PROGRESS → "In Progress"),
`getInitials`.

---

## 4. Rules that apply to EVERY task (this is the rubric)

**Backend — every `data/*` function and `actions/*` action must:**
1. Validate input with the matching Zod schema (`safeParse`).
2. Get the current user (`requireUser`) and check permission before doing anything.
3. Only return/modify data the user is allowed to see (scope queries by
   membership/role — never return another team's data).
4. Return an `ActionResult` (actions) — never throw raw errors to the UI.
5. Revalidate affected pages after a write (`revalidatePath`).

**Frontend — every page/list must handle all three states:**
1. **Loading** — skeletons or spinners while data loads.
2. **Empty** — a friendly "nothing here yet" message.
3. **Error** — a clear error state, not a blank screen.
   Plus: admin-only buttons hidden from developers, responsive on mobile,
   and basic accessibility (labels, focus, semantic elements).

---

## 5. Build order (milestones)

Work top to bottom. Each milestone is a vertical slice so the two tracks can
integrate as they go. Agree on the action signatures at the start of each
milestone before splitting off.

### Milestone 1 — Projects
Backend:
- [ ] `data/projects.ts` — list projects the user can access, get one project
      with owner/members/issue count (`ProjectWithRelations`).
- [ ] `actions/project-actions.ts` — create / edit / delete project
      (admin-only via `canManageProjects`), add/remove members.
- [ ] `app/api/projects/route.ts` + `app/api/projects/[projectId]/route.ts` —
      REST equivalents for Postman testing.
Frontend:
- [ ] `app/(dashboard)/projects/page.tsx` + `project-list.tsx` + `project-card.tsx`
- [ ] `app/(dashboard)/projects/new/*` + `components/projects/project-form.tsx`
- [ ] `app/(dashboard)/projects/[projectId]/*` (header, issues, members)
- [ ] `app/(dashboard)/projects/[projectId]/edit/*`
- [ ] `components/projects/project-delete-button.tsx` (admin only)
Done when: an admin can create/edit/delete a project and see its members;
a developer sees only their projects and no admin buttons.

### Milestone 2 — Issues (the core of the app)
Backend:
- [ ] `data/issues.ts` — list issues (with filters — see Milestone 5), get one
      issue with relations (`IssueWithRelations`).
- [ ] `actions/issue-actions.ts` — create / edit / assign / change status /
      change priority / delete (delete is admin-only; edit gated by `canEditIssue`).
- [ ] `app/api/issues/route.ts` + `app/api/issues/[issueId]/route.ts`.
Frontend:
- [ ] `app/(dashboard)/issues/page.tsx` + `issue-table.tsx`
- [ ] `app/(dashboard)/issues/new/*` + `components/issues/issue-form.tsx`
- [ ] `app/(dashboard)/issues/[issueId]/*` (header, details)
- [ ] `app/(dashboard)/issues/[issueId]/edit/*`
- [ ] `components/issues/*` — `issue-card`, `assignee-select`,
      `issue-status-badge`, `issue-priority-badge`, `issue-delete-button`
Done when: issues can be created, viewed, edited, assigned, and have their
status/priority changed; only admins see delete; developers can only edit issues
assigned to them.

### Milestone 3 — Comments
Backend:
- [ ] `data/comments.ts` — list comments for an issue (`CommentWithAuthor`).
- [ ] `actions/comment-actions.ts` — add comment, delete comment
      (own comment, or admin, via `canDeleteComment`).
- [ ] `app/api/comments/route.ts` + `app/api/comments/[commentId]/route.ts`.
Frontend:
- [ ] `app/(dashboard)/issues/[issueId]/issue-comments.tsx` + `add-comment-form.tsx`
- [ ] `components/comments/*` — `comment-list`, `comment-card`, `comment-form`,
      `comment-delete-button`
Done when: users can comment on an issue, see all comments with author + time,
and delete their own (admins delete any).

### Milestone 4 — Dashboard
Backend:
- [ ] `data/dashboard.ts` + `actions/dashboard-actions.ts` — produce a
      `DashboardStats`: open issues, completed this week, project count,
      high-urgency bugs (scoped to what the user can see).
- [ ] `app/api/dashboard/route.ts`.
Frontend:
- [ ] `app/(dashboard)/dashboard/page.tsx` + `dashboard-cards.tsx` +
      `dashboard-loading.tsx` — responsive metric-card grid with loading state.
Done when: the four cards show correct numbers for the logged-in user.

### Milestone 5 — Filtering & search
Backend:
- [ ] Extend `data/issues.ts` to read `IssueFilters` (status, priority,
      assignee, project, search text) and filter the query. Pagination optional.
Frontend:
- [ ] `app/(dashboard)/issues/issue-filters.tsx` + `components/shared/search-input.tsx`
- [ ] Reflect active filters in the URL query params; add a "clear filters" control.
- [ ] `components/shared/pagination.tsx` if you did pagination.
Done when: the issue list narrows by status/priority/assignee/project and text
search, and filters survive a page refresh (they're in the URL).

### Milestone 6 — Shell, states & polish
Frontend:
- [ ] `components/ui/*` — build the primitives you've been reaching for
      (button, input, textarea, select, card, badge, modal, table, skeleton,
      alert, empty-state) and refactor pages to use them.
- [ ] `components/layout/*` — `app-navbar`, `app-sidebar`, `mobile-nav`,
      `user-menu` (shows current user + logout), `page-header`. Role-aware nav.
- [ ] `components/shared/*` — `loading-spinner`, `confirm-dialog`.
- [ ] `app/(dashboard)/users/*` and `settings/page.tsx` (users list is admin-only).
- [ ] Pass a responsive + accessibility check on every page.
Done when: the app looks and works well on desktop and mobile, nav reflects
role, and every list has loading/empty/error states.

---

## 6. Backend track — full checklist

- [ ] `data/projects.ts`
- [ ] `data/issues.ts` (+ filtering in Milestone 5)
- [ ] `data/comments.ts`
- [ ] `data/dashboard.ts`
- [ ] `data/users.ts` (admin-only user list)
- [ ] `actions/project-actions.ts`
- [ ] `actions/issue-actions.ts`
- [ ] `actions/comment-actions.ts`
- [ ] `actions/dashboard-actions.ts`
- [ ] `actions/user-actions.ts` (optional: change user role — admin only)
- [ ] All 7 `app/api/**/route.ts` handlers + a Postman collection in `postman/`

## 7. Frontend track — full checklist

- [ ] `components/ui/*` (11 primitives)
- [ ] `components/layout/*` (navbar, sidebar, mobile-nav, user-menu, page-header)
- [ ] `components/shared/*` (search-input, pagination, confirm-dialog, loading-spinner)
- [ ] Projects pages + `components/projects/*`
- [ ] Issues pages + `components/issues/*`
- [ ] Comments UI + `components/comments/*`
- [ ] Dashboard page + cards
- [ ] Users table + Settings page

---

## 8. Stretch goals (only after the above works)

Kanban board, drag-and-drop status, tags/labels, due dates, activity log,
dark mode, optimistic UI, pagination, admin user management, unit tests.

---

## 9. Before you submit

- [ ] `npx tsc --noEmit` is clean and `npm run lint` passes.
- [ ] App runs from a fresh clone following Section 2.
- [ ] Every list has loading, empty, and error states.
- [ ] Permissions verified: log in as a developer and confirm you CANNOT do
      admin-only things or see other teams' data.
- [ ] Clear, small git commits.
- [ ] Open a Pull Request describing what you built and any decisions/trade-offs.






1. Project Summary 

The goal is to build a simple full-stack bug tracker using Next.js. 

The app should simulate a real internal engineering tool where users can create, view, assign, update, comment on, and filter bugs across multiple projects. 

This project is meant to benchmark whether interns can work in a realistic product environment before being given production-level work. 

 

2. Core Product Concept 

Users should be able to: 

Sign in 

View projects 

View bugs/issues inside a project 

Create new bug reports 

Assign bugs to users 

Change bug status 

Change bug priority 

Comment on bugs 

Filter and search bugs 

View a dashboard of active work 

Use the app on desktop and mobile 

Admins should have more control than regular developer users. 

 

3. User Roles 

3.1 Admin 

Admins manage the whole workspace. 

Admins can: 

Create projects 

Edit projects 

Delete projects 

View all issues 

Create issues 

Edit any issue 

Delete any issue 

Assign issues to any user 

Change issue status 

Change issue priority 

Comment on any issue 

View all users 

Optional admin feature: 

Change user roles 

 

3.2 Developer User 

Developer users represent team members working on assigned bugs. 

Developers can: 

View projects they are part of 

View issues assigned to them 

View issues in their projects 

Create new issues 

Edit issues assigned to them 

Change the status of assigned issues 

Comment on issues in their projects 

Filter and search issues 

Developers cannot: 

Delete projects 

Delete other users’ issues 

Edit issues outside their assigned projects 

Change another user’s role 

Access admin-only pages 

 

4. Required Features 

4.1 Authentication 

The app should include basic authentication. 

Required Functionality 

Login page 

Logout functionality 

Protected dashboard routes 

User session handling 

Redirect unauthenticated users to login 

Role-based redirects or access control 

Required Tools 

Use: 

NextAuth/Auth.js 

Custom credentials auth 

Zod validation with a safeParse pipeline 

Backend Responsibilities 

Backend developers are responsible for: 

Setting up the auth provider 

Creating the credentials login flow 

Validating login input 

Protecting server routes/actions 

Adding session checks 

Ensuring users cannot access unauthorized data 

Restricting admin-only actions 

Frontend Responsibilities 

Frontend developers are responsible for: 

Building the login UI 

Showing loading states while authentication is processing 

Displaying the current user in the navbar/sidebar 

Showing different navigation options based on user role 

Redirecting users clearly when they are unauthorized 

 

4.2 Dashboard 

The dashboard should give a quick summary of the workspace. 

Required Dashboard Cards 

Total open issues 

Issues completed this week 

Total projects count 

High-urgency bugs 

Frontend Responsibilities 

Frontend developers are responsible for: 

Building the dashboard layout 

Creating metric cards 

Creating a responsive dashboard grid 

Displaying loading states 

Displaying error states 

Displaying empty states 

Backend Responsibilities 

Backend developers are responsible for: 

Providing dashboard data 

Aggregating issue counts 

Calculating completed issues for the current week 

Calculating high-urgency bugs 

Returning only data the current user is allowed to see 

 

4.3 Projects 

Projects are containers for issues. 

Required Project Fields 

Each project should include: 

Project name 

Description 

Created date 

Owner/admin 

Members 

Required Project Features 

Users should be able to: 

View all accessible projects 

View a single project page 

View project issue count 

Admins should also be able to: 

Create projects 

Edit projects 

Delete projects 

Frontend Responsibilities 

Frontend developers are responsible for: 

Project list page 

Project detail page 

Create project form 

Edit project form 

Project cards or project table 

Admin-only buttons hidden from normal users 

Loading, error, and empty states 

Backend Responsibilities 

Backend developers are responsible for: 

Project database model 

Project CRUD logic 

Role-based permission checks 

Project membership logic 

Returning only projects the current user can access 

 

4.4 Issues / Bugs 

Issues are the main object in the app. 

Required Issue Fields 

Each issue should include: 

Title 

Description 

Status 

Priority 

Project 

Assignee 

Reporter 

Created date 

Updated date 

Optional fields: 

Due date 

Tags 

Required Statuses 

Issues should support these statuses: 

Backlog 

Todo 

In Progress 

In Review 

Done 

Required Priorities 

Issues should support these priorities: 

Low 

Medium 

High 

Critical 

Required Issue Features 

Users should be able to: 

Create issues 

View issue details 

Edit issues 

Assign issues to users 

Change issue status 

Change issue priority 

Filter by status 

Filter by priority 

Filter by assignee 

Search by title or description 

Admins should also be able to: 

Delete issues 

Frontend Responsibilities 

Frontend developers are responsible for: 

Issue list/table 

Issue detail page 

Create issue form 

Edit issue form 

Status dropdown 

Priority dropdown 

Assignee selector 

Filter/search controls 

Responsive issue layout 

Loading, error, and empty states 

Backend Responsibilities 

Backend developers are responsible for: 

Issue database model 

Issue create/read/update/delete logic 

Search and filter query logic 

Input validation 

Permission checks 

Preventing unauthorized edits 

Preventing unauthorized deletes 

Ensuring users only see issues they are allowed to access 

 

4.5 Comments 

Each issue should support comments. 

Required Comment Fields 

Each comment should include: 

Comment body 

Author 

Issue 

Created date 

Optional field: 

Updated date 

Required Comment Features 

Users should be able to: 

Add comments 

View comments on the issue detail page 

Delete their own comments 

Admins should also be able to: 

Delete any comment 

Optional feature: 

Edit own comment 

Frontend Responsibilities 

Frontend developers are responsible for: 

Comment form 

Comment list 

Comment card/component 

Delete/edit buttons where allowed 

Optional optimistic update behavior 

Backend Responsibilities 

Backend developers are responsible for: 

Comment database model 

Create comment logic 

Delete comment logic 

Optional edit comment logic 

Permission checks 

Input validation 

 

4.6 Filtering and Search 

Users should be able to narrow down issues. 

Required Filters 

The app should support filtering by: 

Status 

Priority 

Assignee 

Project 

Search text 

Optional Filters 

The app may also support filtering by: 

Reporter 

Created date 

Tags 

Due date 

Frontend Responsibilities 

Frontend developers are responsible for: 

Filter controls 

Search input 

Clear filters button 

Active filter display 

URL query params, recommended 

Backend Responsibilities 

Backend developers are responsible for: 

Query filtering logic 

Search logic 

Pagination support, recommended 

Ensuring users only see allowed issues 

 

4.7 Responsive UI 

The app should work on desktop and mobile. 

Required Functionality 

The UI should include: 

Desktop sidebar or top navigation 

Mobile-friendly navigation 

Responsive tables or card layouts 

Forms usable on small screens 

No major layout overflow bugs 

Frontend Responsibilities 

Frontend developers are responsible for: 

Tailwind styling 

Responsive layouts 

Component polish 

Accessibility basics 

Mobile usability 

 

5. Optional Stretch Features 

These are not required for the minimum version, but stronger interns can attempt them. 

Optional features: 

Kanban board 

Drag-and-drop issue status updates 

Tags/labels 

Due dates 

Activity log 

Admin user management 

Pagination 

Dark mode 

Optimistic UI updates 

Basic unit tests 

Postman collection for backend testing 

 

6. Frontend Developer Responsibilities 

Frontend developers are responsible for the user-facing app experience. 

Frontend Scope 

Frontend developers should build: 

Login page 

Dashboard page 

Project list page 

Project detail page 

Issue list page 

Issue detail page 

Create issue form 

Edit issue form 

Comment UI 

Filter/search UI 

Navbar/sidebar 

Loading states 

Empty states 

Error states 

Responsive mobile layout 

Optional frontend scope: 

Kanban board 

Dark mode 

Optimistic UI updates 

Frontend Deliverables 

Frontend developers should submit: 

Working UI 

Reusable component structure 

Clean page layouts 

Forms connected to backend actions or APIs 

Responsive design 

Basic accessibility 

Clear Git commits 

Pull request with description of completed work 

 

7. Backend Developer Responsibilities 

Backend developers are responsible for data, business logic, security, and server-side behavior. 

Backend Scope 

Backend developers should build: 

Database schema 

User model 

Project model 

Issue model 

Comment model 

Project membership model 

Authentication setup 

Role-based authorization 

CRUD actions for projects 

CRUD actions for issues 

CRUD actions for comments 

Search and filtering logic 

Dashboard aggregation logic 

Input validation 

Seed script 

Backend Deliverables 

Backend developers should submit: 

Working database schema 

Auth/session setup 

Protected backend routes/actions 

CRUD logic 

Validation logic 

Role-based access control 

Search/filter logic 

Dashboard aggregation logic 

Seed script 

Postman-tested endpoints or actions where applicable 

Clear Git commits 

Pull request with explanation of backend decisions 

 

8. Required Tech Stack 

The project should use: 

Next.js 

TypeScript 

Tailwind CSS 

Prisma 

Zod 

NextAuth/Auth.js 

Postman for local testing 

database: 

MySQL instance will be up and running 

 

9. Minimum Viable Product 

The minimum completed version should include: 

Login/logout 

Protected dashboard 

User roles 

Project list 

Project detail page 

Issue list 

Issue detail page 

Create issue 

Edit issue 

Assign issue 

Change issue status 

Change issue priority 

Add comments 

Delete own comments 

Admin-only project controls 

Admin-only issue deletion 

Basic filtering/search 

Responsive layout 

Seed data 

 

10. Final Evaluation Criteria 

Interns should be evaluated on: 

Frontend 

UI quality 

Component organization 

Responsiveness 

Form handling 

Loading states 

Error states 

Empty states 

Code readability 

Basic accessibility 

Backend 

Database design 

Auth implementation 

Session handling 

Role-based permissions 

CRUD logic 

Validation 

Search/filter logic 

Error handling 

Seed data quality 

Code readability 