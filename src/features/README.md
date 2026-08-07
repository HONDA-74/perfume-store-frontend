# features/

Feature-based modules. Each subfolder is a bounded, self-contained slice of
the product (mirrors the backend's per-module boundary in
`SYSTEM_ARCHITECTURE.md` §2, applied to the frontend).

**No features are implemented in this scaffold** — this folder is
intentionally empty except for this document. It exists so the convention
is fixed before any feature code is written.

## Planned features (per UX_FLOW.md / PROJECT_CONTEXT.md — not yet built)

`auth`, `catalog` (products/categories/brands browsing), `product-detail`,
`cart`, `wishlist`, `checkout`, `orders`, `account`, `scent-matchmaker`.

## Convention each feature should follow once implemented

```text
src/features/<feature-name>/
├── components/     # Feature-only UI, never imported by other features
├── hooks/          # Feature-only hooks (TanStack Query hooks live here)
├── services/       # API calls for this feature (uses src/lib/axios.ts)
├── stores/         # Feature-only Zustand store, if needed
├── types.ts        # Feature-local types/DTOs
├── constants.ts    # Feature-local constants
└── index.ts        # Public surface — the ONLY thing other features/routes import
```

Rules (mirroring the backend's AI_RULES.md §2 module boundaries):

- A feature never reaches into another feature's internals — only its
  `index.ts` public surface.
- Shared, feature-agnostic UI belongs in `src/components/`, not duplicated
  per feature.
- Cross-feature state coordination (e.g. cart badge count shown in the
  header) is composed at the route/layout level, not by one feature
  importing another's store directly.
