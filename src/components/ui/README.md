# components/ui/

Shared, presentation-only primitives (Button, Input, Select, Checkbox,
Badge, Card, Modal, Drawer, Tooltip, etc.) as specified component-by-
component in `Design_System.md` §3.

**No components are implemented in this scaffold** — this folder is
intentionally empty except for this document, per scope ("do not implement
UI features yet"). It exists so the convention is fixed in advance.

## Convention each primitive should follow once implemented

- Built with `class-variance-authority` (`cva`) for `variant`/`size` props,
  exactly as `Design_System.md` §3 specifies per component (e.g. Button's
  `variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`).
- Every wrapper accepts `className?: string` and merges it via
  `cn()` from `src/lib/cn.ts` (Design_System.md §6 rule 6).
- Colors/spacing/radius/type reference the Tailwind utilities generated
  from `src/styles/tokens.css` — never a raw hex value or arbitrary bracket
  value (Design_System.md §6 rule 2).
- Every interactive primitive meets the accessibility requirements listed
  under its spec entry (ARIA roles, keyboard behavior, focus handling).
- One component per file, kebab-case filename (e.g. `button.tsx`), named
  export, with an explicitly exported `ComponentNameProps` interface
  (Design_System.md §6 rule 4).
- A barrel `index.ts` re-exports the public primitives once they exist.
