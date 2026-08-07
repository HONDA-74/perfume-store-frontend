# components/shared/

Composite components that compose multiple `ui/` primitives and are reused
across more than one feature, but are NOT generic enough to belong in
`ui/` itself — e.g. a `ProductCard` used on both the catalog grid and the
"Related Products" carousel, an `EmptyState`, or a `ScreenState` wrapper
implementing the five deterministic states every data view must support
(`Design_System.md` §15 / `UX_FLOW.md`: Idle, Loading, Success, Empty, Error).

**No components are implemented in this scaffold** — intentionally empty
except for this document, per scope.

## Distinction from `components/ui/`

- `ui/` — zero domain knowledge, could ship as a standalone design-system
  package (Button, Input, Modal).
- `shared/` — has a *little* domain awareness (knows what a "product" or
  an "order status badge" is) but is still reused across ≥2 features. If a
  component is only ever used by one feature, it belongs inside that
  feature's own `components/` folder instead (see `src/features/README.md`).
