# TubeAssist (HelpMeAI)

An AI-powered customer support chatbot focused exclusively on YouTube help topics, built with Next.js 14, the Vercel AI SDK, and Supabase.

> Live app: https://help-me-ai.vercel.app
> This repository is a fork of [Lemirq/HelpMeAI](https://github.com/Lemirq/HelpMeAI).

## Overview

TubeAssist lets signed-in users chat with an AI assistant that is scoped to answering questions about YouTube (as a creator or viewer). Responses are streamed in real time, conversations are saved per-user, and chat threads are automatically renamed based on their content. The assistant explicitly declines to help with anything outside of YouTube-related topics.

## Features

- **Streaming AI chat** — responses from Google's Gemini model (`gemini-1.5-flash-latest`) are streamed token-by-token using the Vercel AI SDK (`streamText`) and React Server Components (`createStreamableValue` / `readStreamableValue`), so replies appear incrementally rather than all at once.
- **Scoped system prompt** — the assistant is instructed to only answer YouTube-related questions and to explicitly refuse anything off-topic.
- **Auto-renaming chats** — after a chat has enough context, `generateText` is used to generate a short, descriptive title for the conversation, replacing the default "New Chat" label.
- **Google OAuth authentication** — sign-in is handled via Supabase Auth's Google OAuth provider; the `/chat` route redirects unauthenticated users to `/login`.
- **Persistent, real-time chat history** — each conversation is stored in a Supabase Postgres `chats` table (`id`, `user_id`, `name`, `messages`, `created_at`). The sidebar subscribes to Supabase Realtime so new, updated, and deleted chats reflect instantly without a page refresh.
- **Chat management UI** — a collapsible sidebar (animated with Framer Motion) lists past chats, supports creating new chats and deleting existing ones via a popover menu.
- **User reviews table** — a `reviews` table (`user_id`, `rate`, `message`) is defined in the schema for collecting user feedback/ratings.

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **AI:** Vercel AI SDK (`ai`, `ai/rsc`), `@ai-sdk/google` (Gemini)
- **Auth & Database:** Supabase (`@supabase/ssr`) — Google OAuth, Postgres, Realtime subscriptions
- **UI:** Tailwind CSS, shadcn/ui + Radix primitives, Headless UI, Framer Motion, Lucide/Heroicons/react-icons, `react-markdown`
- **Deployment:** Vercel

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx             # Root layout, fonts, metadata
│   ├── chat/
│   │   ├── page.tsx            # Chat route (auth-gated)
│   │   └── actions.ts            # Server actions: continueConversation, renameChat
│   └── login/
│       ├── page.tsx             # Login page
│       └── actions.ts             # Server actions: login (Google OAuth), logout
├── components/
│   ├── chat.tsx                # Chat UI, message list, input, streaming logic
│   ├── sidebar.tsx               # Chat history sidebar with realtime updates
│   └── ui/                        # shadcn/Radix UI primitives (Button, Input, Popover, etc.)
├── lib/                          # Shared utilities (e.g. useMousePosition, cn helper)
├── utils/supabase/                # Supabase client/server helper factories
├── database.types.ts               # Generated Supabase schema types (chats, reviews tables)
└── public/                          # Static assets
```

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key
```

You'll also need a Supabase project with:
- Google OAuth configured as an auth provider
- A `chats` table (`id`, `user_id`, `name`, `messages`, `created_at`) with Realtime enabled
- A `reviews` table (`id`, `user_id`, `rate`, `message`, `created_at`)

## Deployment

The app is deployed on [Vercel](https://vercel.com). Pushing to `master` triggers a new deployment; environment variables must be configured in the Vercel project settings to match `.env.local`.

## Attribution

Forked from [Lemirq/HelpMeAI](https://github.com/Lemirq/HelpMeAI). Built on the [Next.js](https://nextjs.org/) `create-next-app` template.
