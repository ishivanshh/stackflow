This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Stackflow

Stackflow is a developer community built with Next.js 16, React, Appwrite, and Tailwind CSS. It combines a Stack Overflow-style Q&A platform with a separate Blog module.

## Features

- Email/password authentication through Appwrite Account.
- Questions with Markdown content, tags, attachments, answers, comments, votes, and author profiles.
- Blog CRUD with drafts, publishing, slug uniqueness, tags, cover images, and row permissions.
- Shared Appwrite Storage bucket for question attachments and Blog cover images.
- Questions sidebar with popular tags, trending questions, and active users.
- Feedback form at `/feedback`.

## Requirements

- Node.js 20 or newer.
- An Appwrite project.
- Appwrite TablesDB and Storage access.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` in the project root:
| `/users/[userId]/[userSlug]` | User profile and activity overview. |
| `/users/[userId]/[userSlug]/questions` | Questions asked by a user. |
| `/users/[userId]/[userSlug]/answers` | Answers written by a user. |
| `/users/[userId]/[userSlug]/votes` | User vote history. |
| `/users/[userId]/[userSlug]/edit` | Edit profile. |
| `/feedback` | Client-side feedback form and thank-you state. |

### Blog routes

| Route | Purpose |
| --- | --- |
| `/blogs` | Published Blog listing with featured cards and sample fallback data. |
| `/blogs/write` | Authenticated Blog editor with Markdown, tags, cover upload, publish, and draft actions. |

### API routes

| Method and route | Purpose |
| --- | --- |
| `POST /api/answer` | Create an answer. |
| `DELETE /api/answer` | Delete an answer owned by the current author. |
| `POST /api/vote` | Create, switch, or remove a question/answer vote. |
| `GET /api/blogs` | List published Blogs or fetch by `id`, `slug`, or `mine=true`. |
| `POST /api/blogs` | Create a Blog as a draft or published post. |
| `PATCH /api/blogs` | Update, publish, or save a Blog as draft. |
| `DELETE /api/blogs` | Delete an owned Blog. |
| `POST /api/storage/ensure` | Authenticated setup of the shared attachment bucket. |

## Appwrite Resources

The configured database and resource IDs are centralized in [`models/name.ts`](models/name.ts):

```text
Database: main-stackoverflow
Tables: questions, answers, comments, votes, blogs
Storage bucket: question-attachment
```

### TablesDB columns

The application uses the current Appwrite TablesDB API: `createRow`, `getRow`, `listRows`, `updateRow`, and `deleteRow`. It does not use the deprecated document APIs.

#### Questions

- `title` - required text
- `content` - required text
- `authorId` - required text
- `tags` - text
- `attachmentId` - optional text containing a Storage file ID

#### Answers

- `content` - required text
- `authorId` - required text
- `questionId` - required text

#### Comments

Comments reference either a question or answer and an author.

#### Votes

- `type` - `question` or `answer`
- `typeId` - referenced question or answer row ID
- `votedById` - user ID
- `voteStatus` - `upvoted` or `downvoted`

#### Blogs

- `title` - required text
- `slug` - required text; create a unique index on this column in Appwrite
- `content` - required text
- `coverImage` - optional text containing a Storage URL
- `extraContent` - optional text used as the Blog subheading
- `tags` - optional text containing a JSON array
- `status` - required text: `draft` or `published`
- `createdAt` - required datetime
- `updatedAt` - required datetime

The Blog table uses row-level permissions. Drafts are readable only by their author. Published rows are readable publicly, while updates and deletes remain author-only.

### Storage

Questions and Blogs intentionally share the existing `question-attachment` bucket, exposed in code as `attachmentBucket`. The application does not create a separate Blog bucket.

The bucket should allow:

- Create for authenticated users.
- Read for anyone, so public question and Blog images can render.
- Update and delete for authenticated users.
- Image extensions: `jpg`, `png`, `jpeg`, `webp`, `gif`, and `heic`.

Question rows store a file ID in `attachmentId`. Blog rows store a file view URL in `coverImage`. Both file types remain logically associated with their own table row.

## Appwrite to Next.js Flow

### 1. Browser configuration

[`models/client/config.ts`](models/client/config.ts) creates the browser Appwrite client with the public endpoint and project ID. It exposes `Account`, `TablesDB`, `Storage`, and `Avatars` for client-side operations.

Client components use this configuration for login, file selection/upload, vote lookup, and interactive UI updates.

### 2. Server configuration

[`models/server/config.ts`](models/server/config.ts) creates the Node Appwrite client and adds `APPWRITE_API_KEY`. It exposes privileged TablesDB, Storage, and Users services to Server Components and Route Handlers.

This file must never be imported into a client component.

### 3. Authentication

[`store/Auth.ts`](store/Auth.ts) manages the existing Appwrite session with Zustand. On login it stores the session, user, and a JWT created by `account.createJWT()`.

The global [`AuthGuard`](app/components/AuthGuard.tsx) verifies the session and redirects unauthenticated users to `/login`. Blog API calls send the JWT as:

```http
Authorization: Bearer <jwt>
```

[`lib/appwrite/blogAuth.ts`](lib/appwrite/blogAuth.ts) creates a request-scoped Appwrite client with that JWT and obtains the authenticated user. The Blog service never trusts a client-provided author ID.

### 4. Reading data

Server Components query Appwrite directly through the Node SDK. For example, `/questions` loads question rows, then loads each author, answer count, and vote count before passing serializable data to `QuestionCard`.

The Blog listing calls `getPublishedBlogs()`, which filters for `status = published`. If there are no published rows, it displays five in-memory sample Blogs from [`lib/blogSampleData.ts`](lib/blogSampleData.ts); samples are never inserted into Appwrite.

### 5. Mutating data

Forms and interactive controls call dedicated Route Handlers. The handler validates the request, performs the TablesDB row operation server-side, and returns JSON.

The Blog write flow is:

1. The user selects an image in `/blogs/write`.
2. The client calls `POST /api/storage/ensure` with the existing JWT.
3. The client uploads the file to `attachmentBucket` using Appwrite Storage.
4. The client sends the Blog fields and file URL to `POST /api/blogs`.
5. The server derives the authenticated user and creates the Blog row with timestamps and permissions.

The question flow is similar, except the file ID is stored as `attachmentId` in the question row.

### 6. Voting

`VoteButtons` first loads the current user&apos;s vote for a target. `POST /api/vote` then:

- Creates a vote when none exists.
- Updates the row when switching between upvote and downvote.
- Deletes the row when the same vote is clicked again.

Question and answer votes use the same `votes` table and are distinguished by `type` and `typeId`.

## Important Source Directories

```text
app/                 Next.js pages, layouts, and API Route Handlers
components/          Shared interactive UI and Q&A components
lib/appwrite/        Server-only Blog service and auth helpers
models/client/       Browser Appwrite configuration
models/server/       Server Appwrite configuration and resource setup
store/               Zustand authentication state
types/               Shared TypeScript types
utils/               Slugs, tags, timestamps, and attachment URLs
```

## Appwrite Console Checklist

1. Create or select the database ID `main-stackoverflow`.
2. Create the `questions`, `answers`, `comments`, `votes`, and `blogs` tables, or allow the server setup helpers to create them.
3. Add the Blog columns listed above.
4. Add a unique index for `blogs.slug`.
5. Create or verify the `question-attachment` Storage bucket.
6. Set public read permissions for image files.
7. Add the server API key to `.env` as `APPWRITE_API_KEY`.
8. Never commit `.env` or expose the API key in browser code.

## Deployment

For a production deployment, configure the same environment variables in the hosting provider and add the production deployment URL to the Appwrite platform settings. Keep the Appwrite endpoint and project ID public, but keep the API key server-only.


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
