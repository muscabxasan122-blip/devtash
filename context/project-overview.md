DevStash --- Project Overview

Status: Product/technical planning document
Schema status: The Prisma models in this document are a rough
draft, not a final production schema.
Primary goal: Build a fast, searchable, developer-first knowledge
hub for code, prompts, notes, commands, links, and eventually
files/images.

1. Product Summary

DevStash is a personal developer knowledge vault.

Developers repeatedly save useful information in different places: VS
Code, Notion, browser bookmarks, chat history, .txt files, GitHub
gists, project folders, and shell history. DevStash brings those
resources into one fast, searchable workspace.

Core value proposition

Save it once. Find it instantly. Reuse it anywhere.

The product should optimize for capture speed + retrieval speed,
rather than becoming another heavy documentation tool.

Product principles

Fast first --- creating or finding an item should take seconds.

Developer-native --- code, Markdown, commands, URLs, and
technical terminology are first-class.

Searchable by default --- every item should be easy to
rediscover.

Organize without friction --- tags and collections should help,
not become mandatory bureaucracy.

AI should enhance knowledge --- AI features should operate on
the user's saved knowledge rather than feel bolted on.

Progressive complexity --- the MVP should stay small while the
architecture leaves room for Pro features.

2. Problem

Developers keep their essentials scattered across:

Code snippets in VS Code or Notion

AI prompts in chat histories

Context files buried inside projects

Useful links in browser bookmarks

Documentation in random folders

Commands in .txt files

Project templates in GitHub gists

Terminal commands in shell history

This creates:

Context switching

Lost knowledge

Repeated searching

Duplicated work

Inconsistent workflows

Difficulty rediscovering previously solved problems

DevStash centralizes this knowledge into one searchable system.

3. Target Users

User                                Main need

Everyday Developer                  Quickly save and retrieve snippets,
prompts, commands, and links

AI-first Developer                  Store prompts, context files,
workflows, and system instructions

Content Creator / Educator          Keep code examples, explanations,
and course notes organized

Primary persona

The initial product should optimize for the everyday developer /
AI-first developer rather than trying to serve every
knowledge-management use case.

4. Information Architecture

System item types

DevStash starts with these system types:

Type      Content         Icon           Color

Snippet   Text/code       Code         #3b82f6
Prompt    Text            Sparkles     #8b5cf6
Command   Text            Terminal     #f97316
Note      Markdown/text   StickyNote   #fde047
File      File            File         #6b7280
Image     Image           Image        #ec4899
Link      URL             Link         #10b981

Implementation note: File and Image are Pro-gated in the product,
but the data model should support them from the beginning.

System types cannot be renamed or deleted.

Custom item types are planned for a later release.

5. Collections

Collections provide a second organizational layer.

An item can belong to zero, one, or many collections.

Examples

React Patterns

Interview Prep

Python Snippets

Context Files

Prototype Prompts

API Examples

Useful Resources

Important design decision

Collections should not own items exclusively.

Instead:

                ┌──────────────┐
                │    Item      │
                └──────┬───────┘
                       │
                 many-to-many
                       │
                ┌──────▼───────┐
                │  Collection  │
                └──────────────┘

This allows one React snippet to appear in both:

React Patterns

Interview Prep

without duplicating the item.

6. Tags

Tags provide lightweight classification independent of collections.

Examples:

react
typescript
nextjs
api
authentication
postgresql
prompt-engineering
docker

A tag can be attached to many items, and an item can have many tags.

Item ──────< ItemTag >────── Tag

Recommended behavior

Tags should be optional.

Users should be able to create tags while creating/editing an item.

AI can later suggest tags for Pro users.

Search should index tags.

7. Search

Search is a core product feature, not an afterthought.

Users should be able to search across:

Title

Content

Description

Tags

Item type

Collection

Programming language

Example

Searching:

JWT refresh token

could return:

✓ JWT authentication snippet
✓ Refresh token note
✓ Next.js auth command
✓ Authentication API link

Future search evolution

MVP

Keyword search
  ↓
Title + content + tags
  ↓
Filters

Later

Natural-language query
        ↓
Semantic/vector search
        ↓
Hybrid ranking
        ↓
Relevant DevStash knowledge

AI-powered semantic search should be introduced only when basic search
is reliable and fast.

8. Item Creation UX

Creating an item should feel closer to a command palette than a
traditional form.

Suggested flow

        +----------------------+
        |      + New Item      |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Choose item type     |
        |                      |
        |  Code    Prompt      |
        |  Note    Command     |
        |  Link    File        |
        +----------+-----------+
                   |
                   v
        +----------------------+
        | Quick editor         |
        |                      |
        | Title                |
        | Content              |
        | Tags                 |
        | Collections          |
        +----------+-----------+
                   |
                   v
             [ Save Item ]

Items should open in a drawer so users can quickly view/edit them
without losing their current location.

9. Core Features

A. Items

Create items

Edit items

Delete items

Favorite items

Pin items

Recently used items

Assign item type

Add/remove tags

Add/remove collections

View all collections containing an item

Syntax highlighting for code

Markdown editor for text-based types

Import code from a file

Routes

Suggested URL structure:

/items
/items/snippets
/items/prompts
/items/commands
/items/notes
/items/links
/items/files
/items/images
/items/:itemId

Prefer plural, resource-oriented routes consistently.

B. Collections

Create collection

Edit collection

Delete collection

Favorite collection

Add items

Remove items

View collection contents

View collection item types

Optional default type for new items

Suggested routes:

/collections
/collections/:collectionId

C. Favorites & Pins

Two separate concepts:

Favorite

"I like/use this regularly."

Pinned

"Keep this at the top."

Both should be available on items.

Collections can be favorited as well.

D. Recently Used

Track item usage so users can quickly return to recently opened
resources.

Possible future model:

ItemUsage
---------
id
userId
itemId
usedAt

For the MVP, this can potentially be implemented using a lightweight
lastAccessedAt field on Item if detailed analytics are not required.

10. File & Image Storage

File and image uploads are Pro features.

Recommended architecture:

Browser
   |
   | upload request
   v
Next.js
   |
   | signed upload URL
   v
Cloudflare R2
   |
   v
Object stored

Database
   |
   +--> object key
   +--> filename
   +--> MIME type
   +--> size
   +--> metadata

Important

Do not store large binary files directly inside PostgreSQL.

Store the object in Cloudflare R2 and store metadata/reference
information in PostgreSQL.

R2 provides an S3-compatible API, making standard S3-compatible SDKs a
practical integration option.
Reference: Cloudflare R2 API
documentation.

11. Authentication

Supported authentication:

Email/password

GitHub OAuth

The application should use Auth.js / NextAuth integration.

Authentication-related data should be kept separate from
application-specific user preferences where appropriate.

12. AI Features --- Pro

AI is an enhancement layer over the user's existing knowledge.

Planned features

AI Auto-tagging

Saved Item
   ↓
AI analyzes title/content
   ↓
Suggested tags
   ↓
User accepts/rejects

AI Summary

Useful for:

Long notes

Documentation

Context files

Imported content

Explain This Code

Code snippet
    ↓
AI analysis
    ↓
Explanation
    ├── What it does
    ├── How it works
    └── Potential issues

Prompt Optimizer

Original prompt
      ↓
AI
      ↓
Improved prompt
      ↓
User compares versions

AI architecture principle

Do not make every normal CRUD operation depend on AI.

AI calls should be optional, asynchronous where appropriate, and
isolated from core item management.

13. Monetization

DevStash uses a freemium model.

Free

50 items total

3 collections

System item types except File/Image

Basic search

No file uploads

No image uploads

No AI features

Pro --- $8/month or $72/year

Unlimited items

Unlimited collections

File uploads

Image uploads

Custom item types (planned)

AI auto-tagging

AI code explanation

AI prompt optimizer

Export data as JSON/ZIP

Priority support

Development mode

During development:

All users can access all features.

However, the codebase should still implement the concept of
plan/entitlements so Pro gating can be enabled later without rewriting
the architecture.

14. Subscription Architecture

Suggested entitlement flow:

User
 |
 +--> plan/status
       |
       +--> FREE
       |
       +--> PRO
              |
              +--> unlimited items
              +--> file uploads
              +--> AI
              +--> exports

Stripe should be treated as the billing source of truth.

Recommended application data:

User
 ├── stripeCustomerId
 ├── stripeSubscriptionId
 └── plan/status

As the billing system grows, consider a dedicated Subscription model
rather than placing all billing state directly on User.

15. Technical Architecture

Stack

Layer            Technology

Framework        Next.js 16
UI               React 19
Language         TypeScript
Styling          Tailwind CSS v4
Components       shadcn/ui
Database         PostgreSQL / Neon
ORM              Prisma
Auth             Auth.js / NextAuth
Object storage   Cloudflare R2
AI               OpenAI
Payments         Stripe
Cache            Redis (optional)
Deployment       TBD / compatible with Next.js deployment

Next.js is designed for full-stack React applications and supports
Server Components through the App Router.
Reference: Next.js documentation.

Prisma version note

The original plan specified Prisma 7. Current Prisma documentation
indicates that Prisma 8 is now the current major version, while
Prisma 7 remains supported. Before implementation, choose the Prisma
version intentionally rather than hard-coding an outdated assumption.

References:

Prisma documentation

Prisma 7 documentation

If the project deliberately stays on Prisma 7, document that decision in
the repository.

16. Rough Draft Prisma Data Model

⚠️ IMPORTANT: ROUGH DRAFT ONLY

This schema is intended to communicate the proposed data architecture.
It is not the final production Prisma schema. Validate
relationships, indexes, enums, auth integration, constraints, naming,
and Prisma-version-specific syntax before implementation.

// Rough draft — NOT production-ready.
// Validate against the selected Prisma version and Auth.js adapter.

enum Plan {
  FREE
  PRO
}

enum ItemContentType {
  TEXT
  FILE
  URL
}

enum SystemItemType {
  SNIPPET
  PROMPT
  NOTE
  COMMAND
  FILE
  IMAGE
  LINK
}

model User {
  id                    String   @id @default(cuid())
  email                 String?  @unique
  name                  String?
  image                 String?

  plan                  Plan     @default(FREE)
  stripeCustomerId      String?  @unique
  stripeSubscriptionId  String?  @unique

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  items                 Item[]
  collections           Collection[]
  itemTypes             ItemType[]
  tags                  Tag[]

  @@index([email])
}

model Item {
  id              String          @id @default(cuid())
  userId          String

  title           String
  description     String?
  contentType     ItemContentType

  // Text/code/markdown content
  content         String?

  // URL for link items
  url             String?

  // R2 object metadata for file/image items
  fileKey         String?
  fileUrl         String?
  fileName        String?
  fileSize        BigInt?
  mimeType        String?

  language        String?

  isFavorite      Boolean         @default(false)
  isPinned        Boolean         @default(false)

  // Useful for "recently used" without a separate event table.
  lastAccessedAt  DateTime?

  itemTypeId      String

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemType        ItemType        @relation(fields: [itemTypeId], references: [id])

  collections     ItemCollection[]
  tags            ItemTag[]

  @@index([userId, updatedAt])
  @@index([userId, itemTypeId])
  @@index([userId, isPinned])
  @@index([userId, isFavorite])
  @@index([userId, lastAccessedAt])
}

model ItemType {
  id          String         @id @default(cuid())
  userId      String?

  name        String
  icon        String?
  color       String?

  // True for built-in types such as snippet, prompt, note, etc.
  isSystem    Boolean        @default(false)

  // Optional enum/key for identifying system types safely.
  systemKey   SystemItemType?

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  user        User?          @relation(fields: [userId], references: [id], onDelete: Cascade)
  items       Item[]

  @@index([userId])
  @@unique([userId, name])
}

model Collection {
  id              String          @id @default(cuid())
  userId          String

  name            String
  description     String?
  isFavorite      Boolean         @default(false)

  // Optional default type for creating items inside this collection.
  defaultTypeId   String?

  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           ItemCollection[]

  @@index([userId, updatedAt])
  @@index([userId, isFavorite])
}

model ItemCollection {
  itemId        String
  collectionId  String
  addedAt       DateTime   @default(now())

  item          Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection    Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
  @@index([collectionId, addedAt])
}

model Tag {
  id        String    @id @default(cuid())
  userId    String

  name      String

  createdAt DateTime  @default(now())

  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items      ItemTag[]

  @@unique([userId, name])
  @@index([userId])
}

model ItemTag {
  itemId  String
  tagId   String

  item    Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag     Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
  @@index([tagId])
}

17. Data Model Diagram

                         ┌───────────────┐
                         │     User      │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              v                  v                  v
        ┌───────────┐      ┌─────────────┐     ┌─────────┐
        │   Item    │      │ Collection  │     │   Tag   │
        └─────┬─────┘      └──────┬──────┘     └────┬────┘
              │                   │                 │
              │             ┌─────┴─────┐           │
              │             │           │           │
              │             v           │           v
              │      ┌──────────────┐   │      ┌─────────┐
              └─────>│ItemCollection│<──┘      │ ItemTag │
                     └──────────────┘          └────┬────┘
                                                   │
                                                   v
                                                  Item

                         ┌───────────────┐
                         │   ItemType    │
                         └───────┬───────┘
                                 │
                                 v
                                Item

18. Important Data-Model Decisions

Ownership

Every user-created resource must be scoped to its owner.

Conceptually:

User
 ├── Items
 ├── Collections
 ├── Tags
 └── Custom ItemTypes

Never trust a client-provided userId.

The authenticated server-side user should determine ownership.

System Item Types

System types can be seeded globally and referenced by users.

A possible alternative architecture is:

SystemItemType
    |
    +--> global immutable records

instead of copying system types into every user's account.

The final approach should be selected before implementation.

Custom Item Types

Custom types are planned for later.

When introduced, they should always belong to a specific user or
workspace and must not be able to modify/delete system types.

19. Search Architecture

Start simple.

Phase 1

PostgreSQL-based search:

title
content
description
tags
type

Add proper indexes based on measured query patterns.

Phase 2

PostgreSQL full-text search:

User query
    ↓
Search parser
    ↓
PostgreSQL FTS
    ↓
Ranked results

Phase 3

Semantic/hybrid search:

Query
 ├───────────────> Keyword search
 │
 └───────────────> Embedding search
                         │
                         v
                  Semantic matches
                         │
                         v
                    Hybrid ranker
                         │
                         v
                     Results

Do not introduce a vector database until the product has a clear need
for semantic retrieval.

20. API / Server Architecture

Because DevStash is a Next.js application, prefer a simple monorepo-free
single application initially.

Suggested structure:

src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   │   ├── items/
│   │   ├── collections/
│   │   ├── tags/
│   │   ├── uploads/
│   │   └── ai/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── items/
│   ├── collections/
│   └── layout/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── storage/
│   ├── ai/
│   ├── billing/
│   └── search/
│
├── actions/
│   ├── items/
│   ├── collections/
│   └── ...
│
└── types/

The exact folder structure can change as implementation begins.

21. Route / Feature Map

/
├── landing page
│
├── login
├── signup
│
└── app
    ├── dashboard
    ├── items
    │   ├── snippets
    │   ├── prompts
    │   ├── commands
    │   ├── notes
    │   ├── links
    │   ├── files
    │   └── images
    │
    ├── collections
    ├── favorites
    ├── recent
    └── settings
        ├── account
        ├── appearance
        ├── billing
        └── export

22. UI / UX

Design direction

Inspired by:

Notion

Linear

Raycast

But DevStash should feel distinctly developer-focused rather than
becoming a Notion clone.

General

Modern

Minimal

Dark mode by default

Light mode optional

Clean typography

Generous whitespace

Subtle borders

Subtle shadows

Syntax highlighting

Fast keyboard interactions

23. Main Dashboard Layout

┌─────────────────────────────────────────────────────────────┐
│ DevStash                         Search...       + New Item │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  All Items   │              Collections / Items             │
│              │                                              │
│  Snippets    │   ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  Prompts     │   │ React    │ │ Python   │ │ Prompts  │    │
│  Commands    │   │ Patterns │ │ Snippets │ │          │    │
│  Notes       │   └──────────┘ └──────────┘ └──────────┘    │
│  Links       │                                              │
│  Files       │   Recent Items                               │
│  Images      │   ┌──────────────────────────────────────┐   │
│              │   │ useAuth hook                         │   │
│  Favorites   │   │ JWT refresh command                  │   │
│  Recent      │   │ Better API prompt                    │   │
│              │   └──────────────────────────────────────┘   │
│  Collections │                                              │
│  ├ React     │                                              │
│  ├ Python    │                                              │
│  └ Prompts   │                                              │
└──────────────┴──────────────────────────────────────────────┘

24. Item Drawer

Opening an item should not navigate away from the current context
unnecessarily.

┌─────────────────────────────────────────────┐
│ Snippet                         ★   ⋮       │
├─────────────────────────────────────────────┤
│                                             │
│ useAuth Hook                                │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ const { user } = useAuth()              │ │
│ │ ...                                     │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Tags: react  auth  hooks                    │
│                                             │
│ Collections: React Patterns, Auth           │
│                                             │
│ Created Sep 5 • Updated Sep 5               │
│                                             │
│ [ Edit ]                       [ Delete ]   │
└─────────────────────────────────────────────┘

25. Icons

Use a consistent icon system, preferably Lucide, which works
naturally with shadcn/ui.

Concept      Icon

Snippet      Code2
Prompt       Sparkles
Command      Terminal
Note         StickyNote
File         File
Image        Image
Link         Link2
Search       Search
Favorite     Star
Pin          Pin
Collection   Folder
Add          Plus
Settings     Settings
Recent       Clock3
Export       Download
AI           Sparkles

Icons are semantic UI elements; avoid using too many decorative icons.

26. Responsive Design

Desktop-first, but mobile must remain usable.

Desktop

Sidebar + Main Content + Drawer

Tablet

Collapsible Sidebar + Main Content

Mobile

Top Bar
   ↓
Content
   ↓
Sidebar becomes Drawer
   ↓
Item opens as full-screen sheet/drawer

27. Micro-interactions

Use subtle feedback:

Smooth transitions

Card hover states

Toast notifications

Loading skeletons

Copy-to-clipboard confirmation

Save confirmation

Optimistic UI where safe

Keyboard shortcuts

Command palette

Avoid excessive animation. DevStash should feel fast, not flashy.

28. Keyboard-First UX

This is a major opportunity for a developer-focused product.

Potential shortcuts:

Shortcut           Action

⌘/Ctrl + K       Global search
C                Create item
G then I       Go to items
G then C       Go to collections
G then F       Go to favorites
Esc              Close drawer
⌘/Ctrl + Enter   Save item

Exact shortcuts should be finalized after the core UX is implemented.

29. Security & Privacy

DevStash may contain highly sensitive developer information such as:

API examples

Internal URLs

Private prompts

Context files

Project information

Potentially secrets accidentally pasted into snippets

Therefore:

Rules

Never expose another user's records.

Enforce authorization server-side.

Validate ownership on every resource operation.

Never trust client-side Pro checks.

Validate uploaded file metadata and size.

Do not expose private R2 objects publicly by default.

Prefer signed/private object access where appropriate.

Never log item content unnecessarily.

Never send user content to AI without an explicit product reason.

Add clear privacy controls before AI features launch.

Secret detection --- future feature

DevStash could warn users when content appears to contain:

API keys
tokens
private keys
database URLs with credentials

This should be treated as a safety feature, not merely an AI feature.

30. Database Migration Policy

Never use db push for production schema evolution.

The project should use migrations.

Recommended workflow:

Change Prisma schema
        ↓
Create migration
        ↓
Review migration
        ↓
Run locally
        ↓
Test application
        ↓
Commit migration
        ↓
Deploy migration to production

Example development command:

npx prisma migrate dev --name descriptive_change

Production migrations should be applied using the appropriate deployment
workflow, not by manually editing the production database.

The exact commands must match the selected Prisma major version and
deployment setup.

31. Environment Variables

Expected categories:

DATABASE_URL

AUTH_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME

OPENAI_API_KEY

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

Never commit secrets to Git.

Use:

.env.local

for local development and the deployment provider's
secret/environment-variable system for production.

32. Observability

A SaaS product should eventually track:

Application errors

API errors

AI failures

Upload failures

Search latency

Database latency

Authentication failures

Subscription webhook failures

Avoid logging:

Passwords

Auth tokens

API keys

Full private item content

R2 credentials

33. MVP Scope

The biggest risk is trying to build everything at once.

MVP should include

Authentication

Email/password

GitHub OAuth

Items

Create

Read

Update

Delete

Favorite

Pin

Item types

Markdown/code editing

Copy content

Collections

CRUD

Many-to-many item relationships

Favorite

Tags

Create

Assign

Remove

Search/filter

Search

Basic search

Type filtering

Collection filtering

UX

Dashboard

Sidebar

Item drawer

Responsive layout

Dark mode

Toasts

Skeleton loading

Keyboard-friendly interactions

Billing foundation

User plan

Entitlement abstraction

Stripe integration foundation

During development: disable actual restrictions so every feature can
be tested.

34. Post-MVP

Phase 2

Cloudflare R2 uploads

File/image item types

Export JSON/ZIP

Better search

Recently used tracking

More keyboard shortcuts

Phase 3

AI auto-tagging

AI summaries

Explain code

Prompt optimizer

Phase 4

Custom item types

Semantic search

Browser extension

VS Code extension

CLI

API access

Import from other knowledge tools

35. Potential Future Integrations

DevStash becomes more valuable if it can be accessed where developers
already work.

Browser extension

Any webpage
    ↓
"Save to DevStash"
    ↓
Choose type / collection
    ↓
Saved

VS Code extension

Selected code
    ↓
Save to DevStash
    ↓
Choose collection
    ↓
Saved snippet

CLI

devstash save "git reset --soft HEAD~1"

or:

devstash search "postgres migration"

AI coding tools

A long-term opportunity is letting coding agents retrieve the
developer's saved knowledge:

Coding Agent
     ↓
DevStash API
     ↓
Relevant snippets / prompts / notes
     ↓
Agent context

This could become one of DevStash's strongest differentiators.

36. Product Differentiation

DevStash should avoid positioning itself as:

"Another Notion for developers."

A stronger position is:

"Your developer memory layer."

The product is specifically optimized for small, reusable pieces of
technical knowledge.

The key loop is:

Discover something useful
        ↓
Save it
        ↓
Organize automatically
        ↓
Find it later
        ↓
Reuse it
        ↓
Make it better
        ↓
Save the improved version

37. Success Metrics

Early metrics should focus on whether DevStash is becoming a habit.

Activation

User creates first item

User creates first collection

User performs first search

Engagement

Items created per active user

Searches per active user

Items copied/reused

Weekly active users

Returning users

Retention

Day 7 retention

Day 30 retention

Weekly active / monthly active ratio

Monetization

Free → Pro conversion

Monthly recurring revenue

Annual subscription adoption

AI feature usage among Pro users

38. Technical Risks

Risk                                Mitigation

Search becomes slow                 Add indexes and measure queries
before optimizing

Schema becomes too complex          Keep MVP models small

AI costs grow                       Add quotas, caching, and explicit
AI actions

File storage becomes expensive      Use R2 and track file size/usage

Authorization bugs                  Centralize ownership checks

Stripe state becomes inconsistent   Use verified webhooks as billing
events

Custom types complicate UI          Add them after stable system types

Vector search is premature          Start with PostgreSQL search

39. Recommended Engineering Principles

1. Server-side authorization

Every mutation should verify:

Authenticated user
       +
Resource belongs to user
       =
Allowed operation

2. Entitlement abstraction

Do not scatter:

if (user.isPro) ...

throughout the application.

Prefer something conceptually like:

can(user, "upload:file")
can(user, "use:ai")
can(user, "create:item")

This makes plan changes easier later.

3. Keep AI isolated

AI functionality should live behind a dedicated service/module.

lib/ai/
├── client
├── tagging
├── summarization
├── code-explanation
└── prompt-optimizer

4. Keep storage isolated

lib/storage/
├── upload
├── delete
├── signed-url
└── metadata

This makes it possible to change storage providers later.

5. Validate inputs

Use a runtime validation library such as Zod for API/action boundaries.

40. Suggested Build Order

1. Project foundation
       ↓
2. Database + migrations
       ↓
3. Authentication
       ↓
4. App shell / dashboard
       ↓
5. Item CRUD
       ↓
6. Collections
       ↓
7. Tags
       ↓
8. Search
       ↓
9. Favorites / pins / recent
       ↓
10. Markdown + code editor
       ↓
11. Billing architecture
       ↓
12. R2 uploads
       ↓
13. AI layer
       ↓
14. Export
       ↓
15. Polish + testing
       ↓
16. Production launch

41. Definition of Done for MVP

DevStash MVP is ready when a new developer can:

Sign up.

Create a snippet in under a few seconds.

Add it to multiple collections.

Tag it.

Search for it later.

Open it in a drawer.

Copy the content.

Pin/favorite it.

Create and manage collections.

Use the application comfortably in dark mode.

Use the application on a mobile screen.

Never accidentally see another user's data.

The product should feel fast and obvious before adding sophisticated
AI functionality.

42. Documentation & Reference Links

Next.js Documentation

Prisma Documentation

Prisma 7 Documentation

Cloudflare R2 API
Documentation

Cloudflare R2 S3
Compatibility

43. Final Product Vision

DevStash starts as a simple place to save developer knowledge.

Over time, it can become a developer memory system that is
accessible from:

                    ┌──────────────┐
                    │   DevStash   │
                    │ Developer    │
                    │ Memory Layer │
                    └──────┬───────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       v                   v                   v
   Web App             VS Code              CLI
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           v
                    AI Coding Tools

The long-term opportunity is not simply storing snippets.

It is making a developer's accumulated knowledge portable, searchable,
reusable, and available to both the developer and their AI tools.

DevStash --- Your developer memory layer.


## **Design Reference**
See `context/screenshots/dashboard-ui-drawer.png` and `context/screenshots/dashboard-ui-main.png` for the main dashboard design. It does not have to be pixel perfect. Use it as a base.
