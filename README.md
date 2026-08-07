# KENZ — Frontend

React 19 + TypeScript + Vite frontend for KENZ.

> **Status: Architecture scaffold only.** No pages, features, business logic,
> API integration, or authentication are implemented yet. This repository
> currently establishes the project foundation and configuration described
> in `ARCHITECTURE.md`, `Design_System.md`, and `UX_FLOW.md`.

## Documentation — Single Source of Truth

1. `ARCHITECTURE.md` — application architecture, brand identity, component
   philosophy, accessibility standards.
2. `Design_System.md` — design tokens, Tailwind mapping, component specs.
3. `UX_FLOW.md` — page-by-page UX specification.

## Tech Stack

- React 19 + TypeScript
- Vite 6 (`@vitejs/plugin-react-swc`)
- Tailwind CSS v4 (CSS-first `@theme` configuration)
- React Router v7 (data router)
- TanStack Query v5
- Zustand
- React Hook Form + Zod
- Axios
- Framer Motion
- Lucide Icons
- clsx + tailwind-merge (`cn()`)
- class-variance-authority (CVA)

## Getting Started

```bash
npm install
cp .env.example .env.development
npm run dev
```

The app runs at `http://localhost:5173` by default (`VITE_DEV_SERVER_PORT`).

## Scripts

| Script                | Purpose                                   |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the Vite dev server                  |
| `npm run build`        | Type-check and build for production        |
| `npm run preview`      | Preview the production build locally       |
| `npm run lint`         | Lint with ESLint                           |
| `npm run lint:fix`     | Lint and auto-fix                          |
| `npm run format`       | Format with Prettier                       |
| `npm run format:check` | Check formatting without writing           |
| `npm run typecheck`    | Type-check without emitting                |

## Project Structure

See the tree and folder-by-folder explanation provided alongside this
scaffold. In short: `src/features/*` is where product work happens next;
everything else here is foundation those features will build on.

## Environment Variables

Documented in `.env.example`, validated at runtime by `src/config/env.ts`
(fails fast with a clear error if a required `VITE_*` variable is missing
or malformed — mirrors the backend's env validation philosophy).

## Path Alias

`@/*` resolves to `src/*` (configured in `tsconfig.app.json` and read by
Vite via `vite-tsconfig-paths`).

## Conventions

- **Feature-based organization** — see `src/features/README.md`.
- **UI primitives vs. shared composites** — see `src/components/ui/README.md`
  and `src/components/shared/README.md`.
- **Design tokens are the single source of truth** — see
  `src/styles/tokens.css`; never hand-author a raw hex/px value in a
  component when a token exists.
- **kebab-case filenames, PascalCase components/types** — mirrors the
  backend's `AI_RULES.md` §9–10 naming conventions, applied to the frontend.

## Next Steps (not part of this scaffold)

1. Implement `src/components/ui/*` primitives per `Design_System.md` §3.
2. Implement `src/features/auth` and wire session state.
3. Implement `src/features/catalog`, `product-detail`, `cart`, `wishlist`,
   `checkout`, `orders`, `account`, `scent-matchmaker` per `UX_FLOW.md`.
4. Replace the inline route placeholders in `src/routes/routes.config.tsx`
   with real page components as each feature lands.
