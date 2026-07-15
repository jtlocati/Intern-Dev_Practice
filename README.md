Intern Benchmark Project: Bug Tracker / Issue Management App 

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