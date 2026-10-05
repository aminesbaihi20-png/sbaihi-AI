# Rebuild Sbaihi AI in Lovable

## Goal
Recreate the Sbaihi AI web app (currently hosted on Bolt) as a TanStack Start app in Lovable, preserving the friendly AI-companion positioning and the three core tools.

## What will be built

### 1. Design system
- Warm, friendly visual identity based on the existing site: golden/yellow primary, dark navy sidebar, soft off-white background.
- Semantic tokens in `src/styles.css` (oklch).
- Clean card-based UI, rounded corners, friendly iconography.

### 2. Shared layout
- Persistent left sidebar with navigation: New chat, Home, Explainer, CROC, Chat, Help.
- Top bar with brand and credits indicator.
- Mobile-responsive hamburger menu.

### 3. Routes / pages
- `/` — Home/landing with hero, value props, and feature cards.
- `/explainer` — Book & Lesson Explainer tool.
- `/croc` — CROC University Finder tool.
- `/chat` — Chat with Sbaihi AI.
- `/help` — Help page.

### 4. Working functionality
- **Book & Lesson Explainer**: input a book title or lesson name, get a friendly summary (hook, big idea, key points, takeaway) via the Lovable AI Gateway.
- **CROC University Finder**: input high-school grades out of 20, return matching medical universities. Seed a starter dataset of ~32 universities in the migration.
- **Chat**: a simple conversational chat interface powered by the Lovable AI Gateway.
- **Credits**: 5 free credits per day. Implement via Lovable Cloud (auth + database table) so credits are persistent per user, with anonymous fallback using localStorage if sign-up is truly optional.

### 5. Backend / data
- Enable Lovable Cloud.
- Migration: `universities` table with name, country, min_grade, tuition, notes; seed with the 32 universities referenced on the current site.
- Migration: `daily_credits` table for per-user credit tracking.
- Server functions for university matching, explainer, and chat.

### 6. SEO / metadata
- Unique `head()` metadata for every route.
- No placeholder content; all copy specific to Sbaihi AI.

## Out of scope (unless you ask)
- Real-time streaming chat responses (can be added later).
- Payment/subscription tier beyond the free-credit model.
- Multi-language UI.

## First milestone
Build the design system + shared layout + landing page + sidebar navigation, then add each tool route one by one.
