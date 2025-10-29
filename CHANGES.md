# Recent Changes

## Dependency & UI Fixes
- Removed the `vaul` package that was incompatible with React 19 and rebuilt the drawer primitives with `@radix-ui/react-dialog` to keep the same API surface (`package.json:25`, `components/ui/drawer.tsx:1`).
- Restored Tailwind-style centering by defining a responsive `.container` utility so page sections align correctly across breakpoints (`app/globals.css:70`).

## Gemini Image Generation Flow
- Added `/api/generate` to forward prompts and uploaded images to OpenRouter’s Gemini 2.5 Flash Image model, normalizing the returned image URLs (`app/api/generate/route.ts:1`).
- Upgraded the editor experience to support image uploads, validation, async request state, and gallery rendering of generated outputs (`components/editor.tsx:12`).
- Created `.env.local` to store `OPENROUTER_API_KEY` plus optional site metadata used by the OpenRouter client.

## Supabase Social Authentication
- Installed `@supabase/supabase-js` and `@supabase/ssr` to support server-side session handling (`package.json`).
- Added Supabase helpers for server components and route handlers to persist auth cookies securely (`lib/supabase/*.ts`).
- Created reusable OAuth handler plus provider-specific routes for GitHub (`app/auth/github/route.ts`) and Google (`app/auth/google/route.ts`), along with the shared callback/ logout endpoints (`app/auth/callback/route.ts`, `app/auth/logout/route.ts`).
- Updated the site header with a provider menu and sign-out flow backed by Supabase sessions (`components/header.tsx`, `components/header-auth-actions.tsx`).
- Supabase OAuth handler supports multiple providers server-side; configure the desired providers in your Supabase dashboard (`lib/supabase/oauth.ts`).
- Configure `.env.local` with `SUPABASE_URL` and `SUPABASE_ANON_KEY` before running locally.

## Verification
1. Install dependencies with `pnpm install`.
2. Run `pnpm dev` and open the editor section.
3. Upload an image, enter a prompt, and hit “Generate Now”; expect one or more AI-generated images in the output gallery.
