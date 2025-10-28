# Recent Changes

## Dependency & UI Fixes
- Removed the `vaul` package that was incompatible with React 19 and rebuilt the drawer primitives with `@radix-ui/react-dialog` to keep the same API surface (`package.json:25`, `components/ui/drawer.tsx:1`).
- Restored Tailwind-style centering by defining a responsive `.container` utility so page sections align correctly across breakpoints (`app/globals.css:70`).

## Gemini Image Generation Flow
- Added `/api/generate` to forward prompts and uploaded images to OpenRouter’s Gemini 2.5 Flash Image model, normalizing the returned image URLs (`app/api/generate/route.ts:1`).
- Upgraded the editor experience to support image uploads, validation, async request state, and gallery rendering of generated outputs (`components/editor.tsx:12`).
- Created `.env.local` to store `OPENROUTER_API_KEY` plus optional site metadata used by the OpenRouter client.

## Verification
1. Install dependencies with `pnpm install`.
2. Run `pnpm dev` and open the editor section.
3. Upload an image, enter a prompt, and hit “Generate Now”; expect one or more AI-generated images in the output gallery.
