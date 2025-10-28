# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/`; each route keeps co-located page, layout, loading, and API handlers. Shared presentation elements belong in `components/`, with subfolders for domain-specific widgets when they grow. Client-side helpers and integrations go in `hooks/` and `lib/` respectively; keep external API adapters under `lib/`. Global Tailwind layers stay in `styles/`, and static assets (images, fonts) reside in `public/`. Co-locate feature-specific assets with their owning route when possible to keep the tree discoverable.

## Build, Test, and Development Commands
Run `pnpm install` after cloning to sync dependencies. `pnpm dev` launches the local server with hot reload. Use `pnpm lint` before every PR to catch TypeScript and accessibility issues; add `--fix` only once changes are staged. `pnpm build` exercises the production bundle and is the smoke test for deployments. `pnpm start` serves the optimized build locally; use it when verifying environment-specific behavior.

## Coding Style & Naming Conventions
Use TypeScript throughout; favor explicit return types for exported helpers. Components and files are PascalCase (`NavBar.tsx`), hooks camelCase (`useFeatureFlag.ts`), and utility modules kebab-case (`date-format.ts`). Follow Tailwind’s utility-first approach—group spacing, typography, and state classes consistently. Prefer Radix primitives for accessible interactions. Keep JSX lean: extract reusable fragments into `components/` and share types via `lib/types.ts`.

## Testing Guidelines
Automated tests are not yet scaffolded; when adding coverage, prefer React Testing Library with Vitest, naming files `Component.test.tsx` beside the implementation. Until a runner lands, rely on targeted manual verification: run `pnpm lint`, hit high-impact routes under `pnpm dev`, and record expected vs. actual behavior in the PR description.

## Commit & Pull Request Guidelines
Git history uses short, imperative messages (e.g., `feat: add carousel autoplay`). Keep subjects ≤72 characters and describe why in the body when needed. Pull requests should: summarize the change, list manual checks (`pnpm lint`, `pnpm build`), attach UI screenshots when the DOM changes, and link related issues or Linear tickets. Request review once CI (lint/build) is green.
