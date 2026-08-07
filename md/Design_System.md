# Design System & Front-End Implementation Specification

**Project:** KENZ — Premium Multi-Brand Fragrance Marketplace

**Tech Stack:** React, Tailwind CSS, TypeScript, Framer Motion

**Status:** Phase 2 — Official Implementation Reference

**Locale Scope:** Strictly English-Only (`en-US`, LTR)

---

## 1. Design Tokens

The design system relies on CSS Custom Properties injected into the global layer (`:root`). Tailwind maps these tokens directly via `hsl(var(--token) / <alpha-value>)` to enable dynamic opacities without breaking CSS variable resolution.

### 1.1 Color Token Hierarchy

```css
:root {
  /* Brand Palette (Luxury Gold & Deep Obsidian) */
  --color-primary-50: 43 100% 97%;
  --color-primary-100: 43 96% 89%;
  --color-primary-200: 43 92% 78%;
  --color-primary-300: 43 88% 65%;
  --color-primary-400: 43 82% 52%;
  --color-primary-500: 43 78% 44%; /* Primary Metallic Gold */
  --color-primary-600: 43 83% 36%;
  --color-primary-700: 43 87% 28%;
  --color-primary-800: 43 89% 20%;
  --color-primary-900: 43 91% 12%;

  /* Neutral Surface & Typography Palette */
  --color-neutral-0: 0 0% 100%;     /* Pure White */
  --color-neutral-50: 0 0% 98%;    /* Off-White / Light Surface */
  --color-neutral-100: 0 0% 94%;   /* Muted Surface / Light Borders */
  --color-neutral-200: 0 0% 88%;   /* Component Borders */
  --color-neutral-300: 0 0% 74%;   /* Disabled Text / Subtitle */
  --color-neutral-400: 0 0% 56%;   /* Muted Body Text */
  --color-neutral-500: 0 0% 40%;   /* Secondary Body Text */
  --color-neutral-600: 0 0% 28%;   /* Dark Surface Element */
  --color-neutral-700: 0 0% 18%;   /* Deep Charcoal Body Text */
  --color-neutral-800: 0 0% 10%;   /* Onyx Background Surface */
  --color-neutral-900: 0 0% 4%;    /* Obsidian Pure Dark */

  /* Semantic Feedback Palette */
  --color-success-50: 142 76% 96%;
  --color-success-500: 142 71% 45%;
  --color-success-700: 142 76% 22%;

  --color-warning-50: 38 92% 96%;
  --color-warning-500: 38 92% 50%;
  --color-warning-700: 38 92% 25%;

  --color-error-50: 0 84% 97%;
  --color-error-500: 0 84% 60%;
  --color-error-700: 0 84% 30%;

  --color-info-50: 199 89% 96%;
  --color-info-500: 199 89% 48%;
  --color-info-700: 199 89% 24%;
}

```

### 1.2 Typography Tokens

* **Font Families:**
* Headings: Serif (`"Playfair Display", Georgia, serif`)
* Body & UI: Sans-Serif (`"Plus Jakarta Sans", system-ui, sans-serif`)
* Monospace / Technical: `ui-monospace, SFMono-Regular, Menlo, monospace`


* **Scale:**
* `display`: `3.75rem` (60px), Line Height: `1.1`, Letter Spacing: `-0.02em`
* `h1`: `3rem` (48px), Line Height: `1.15`, Letter Spacing: `-0.02em`
* `h2`: `2.25rem` (36px), Line Height: `1.2`, Letter Spacing: `-0.01em`
* `h3`: `1.75rem` (28px), Line Height: `1.25`, Letter Spacing: `-0.01em`
* `h4`: `1.375rem` (22px), Line Height: `1.3`, Letter Spacing: `0`
* `body-lg`: `1.125rem` (18px), Line Height: `1.6`, Letter Spacing: `0`
* `body-md`: `1rem` (16px), Line Height: `1.5`, Letter Spacing: `0`
* `body-sm`: `0.875rem` (14px), Line Height: `1.4`, Letter Spacing: `0.01em`
* `caption`: `0.75rem` (12px), Line Height: `1.33`, Letter Spacing: `0.02em`



### 1.3 Spacing Tokens

* Base Unit: `4px` (`0.25rem`)
* Scale: `0.5` (2px), `1` (4px), `1.5` (6px), `2` (8px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px), `20` (80px), `24` (96px), `32` (128px).

### 1.4 Radius Tokens

* `radius-none`: `0px`
* `radius-sm`: `0.125rem` (2px)
* `radius-md`: `0.25rem` (4px) (Default luxury border radius for buttons/inputs)
* `radius-lg`: `0.5rem` (8px) (Cards, Modals)
* `radius-xl`: `1rem` (16px) (Drawers, Floating Containers)
* `radius-full`: `9999px` (Avatars, Pill Badges)

### 1.5 Shadow Tokens

* `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
* `shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
* `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
* `shadow-xl`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
* `shadow-gold`: `0 4px 20px -2px rgba(212, 160, 23, 0.25)`

### 1.6 Motion Tokens

* **Easings:**
* `ease-standard`: `cubic-bezier(0.2, 0.0, 0.0, 1.0)`
* `ease-enter`: `cubic-bezier(0.0, 0.0, 0.2, 1.0)`
* `ease-exit`: `cubic-bezier(0.4, 0.0, 1.0, 1.0)`


* **Durations:**
* `duration-fast`: `150ms`
* `duration-normal`: `250ms`
* `duration-slow`: `350ms`



### 1.7 Z-Index Tokens

* `z-deep`: `-1`
* `z-base`: `0`
* `z-sticky`: `10`
* `z-dropdown`: `20`
* `z-navbar`: `30`
* `z-drawer`: `40`
* `z-modal`: `50`
* `z-popover`: `60`
* `z-toast`: `70`
* `z-tooltip`: `80`

### 1.8 Breakpoint Tokens

* `sm`: `640px`
* `md`: `768px`
* `lg`: `1024px`
* `xl`: `1280px`
* `2xl`: `1536px`

---

## 2. Tailwind CSS Architecture

### 2.1 Folder Structure

```text
src/
├── styles/
│   ├── globals.css          # Base CSS variables, @tailwind directives, font imports
│   ├── components.css       # Complex layer components (@layer components)
│   └── utilities.css        # Custom utilities (@layer utilities)
├── lib/
│   └── utils.ts             # Contains `cn()` utility combining clsx and tailwind-merge
tailwind.config.ts           # Master theme configuration mapping variables to tokens

```

### 2.2 `tailwind.config.ts` Organization

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    },
    extend: {
      colors: {
        primary: {
          50: 'hsl(var(--color-primary-50) / <alpha-value>)',
          100: 'hsl(var(--color-primary-100) / <alpha-value>)',
          200: 'hsl(var(--color-primary-200) / <alpha-value>)',
          300: 'hsl(var(--color-primary-300) / <alpha-value>)',
          400: 'hsl(var(--color-primary-400) / <alpha-value>)',
          500: 'hsl(var(--color-primary-500) / <alpha-value>)',
          600: 'hsl(var(--color-primary-600) / <alpha-value>)',
          700: 'hsl(var(--color-primary-700) / <alpha-value>)',
          800: 'hsl(var(--color-primary-800) / <alpha-value>)',
          900: 'hsl(var(--color-primary-900) / <alpha-value>)',
        },
        neutral: {
          0: 'hsl(var(--color-neutral-0) / <alpha-value>)',
          50: 'hsl(var(--color-neutral-50) / <alpha-value>)',
          100: 'hsl(var(--color-neutral-100) / <alpha-value>)',
          200: 'hsl(var(--color-neutral-200) / <alpha-value>)',
          300: 'hsl(var(--color-neutral-300) / <alpha-value>)',
          400: 'hsl(var(--color-neutral-400) / <alpha-value>)',
          500: 'hsl(var(--color-neutral-500) / <alpha-value>)',
          600: 'hsl(var(--color-neutral-600) / <alpha-value>)',
          700: 'hsl(var(--color-neutral-700) / <alpha-value>)',
          800: 'hsl(var(--color-neutral-800) / <alpha-value>)',
          900: 'hsl(var(--color-neutral-900) / <alpha-value>)',
        },
        success: {
          50: 'hsl(var(--color-success-50) / <alpha-value>)',
          500: 'hsl(var(--color-success-500) / <alpha-value>)',
          700: 'hsl(var(--color-success-700) / <alpha-value>)',
        },
        error: {
          50: 'hsl(var(--color-error-50) / <alpha-value>)',
          500: 'hsl(var(--color-error-500) / <alpha-value>)',
          700: 'hsl(var(--color-error-700) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: 'var(--shadow-gold)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
        enter: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
        exit: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
      },
    },
  },
  plugins: [],
};

export default config;

```

### 2.3 Utility Conventions & Naming Rules

* **Class Merging:** Always use `cn()` from `src/lib/utils.ts` (combining `clsx` and `tailwind-merge`) when computing conditional component classes.
* **Color Usage:** Prefer semantic token utilities (`bg-primary-500`, `text-neutral-900`) over raw arbitrary colors (e.g., avoid `bg-[#D4A017]`).
* **Typography:** Apply typography styles using established text classes (`font-serif text-h2 text-neutral-900`).
* **State Prefixes:** Order state variants explicitly: `hover:` → `focus-visible:` → `active:` → `disabled:`.

---

## 3. Component Specification

Every shared UI component must follow class-variance-authority (`cva`) patterns and enforce accessibility (ARIA) standards.

---

### 3.1 Button

#### Purpose

Triggers an action or event when clicked. Used for main call-to-actions, secondary actions, and inline forms.

#### Props

* `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`
* `size`: `'sm' | 'md' | 'lg'`
* `isLoading`: `boolean`
* `isDisabled`: `boolean`
* `leftIcon`: `ReactNode`
* `rightIcon`: `ReactNode`
* `children`: `ReactNode`
* `onClick`: `(event: MouseEvent<HTMLButtonElement>) => void`

#### Variants & Styles

* **Primary:** `bg-primary-500 text-neutral-900 hover:bg-primary-600 active:bg-primary-700 shadow-sm`
* **Secondary:** `bg-neutral-800 text-neutral-0 hover:bg-neutral-700 active:bg-neutral-900`
* **Outline:** `border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100`
* **Ghost:** `text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900`
* **Danger:** `bg-error-500 text-neutral-0 hover:bg-error-700`

#### Sizes

* **sm:** `h-8 px-3 text-body-sm font-medium rounded-md gap-1.5`
* **md:** `h-10 px-4 text-body-md font-medium rounded-md gap-2`
* **lg:** `h-12 px-6 text-body-lg font-semibold rounded-md gap-2.5`

#### States

* **Hover:** Slight background shade shift.
* **Focus-Visible:** `outline-none ring-2 ring-primary-500 ring-offset-2`
* **Disabled:** `opacity-50 cursor-not-allowed pointer-events-none`
* **Loading:** Disables button interactions; replaces `leftIcon` or adds a inline `Spinner`.

#### Accessibility Requirements

* Renders as a standard `<button>` element.
* Exposes `aria-disabled="true"` when disabled or loading.
* Exposes `aria-busy="true"` when `isLoading` is true.

#### Responsive & Motion Behavior

* Full-width on mobile viewports (`w-full sm:w-auto`) when specified via wrapper class.
* Active press effect: `active:scale-[0.98] transition-transform duration-fast`.

#### Design Tokens Used

* `color-primary-500`, `color-neutral-800`, `color-error-500`, `radius-md`, `duration-fast`.

#### Composition Rules

* Can contain text + `leftIcon`/`rightIcon`.
* Text must be wrapped cleanly; do not pass raw nested interactive elements inside a Button.

#### Usage Example

```tsx
<Button variant="primary" size="md" leftIcon={<ShoppingBagIcon />}>
  Add to Cart
</Button>

```

#### Do / Don't Guidelines

* **Do:** Use `primary` for the single primary action on a screen (e.g., Checkout, Add to Cart).
* **Don't:** Place multiple primary buttons side-by-side.

---

### 3.2 Icon Button

#### Purpose

Triggers actions where icon-only representations are universally understood (e.g., Close, Wishlist, Search, Cart icon).

#### Props

* `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'`
* `size`: `'sm' | 'md' | 'lg'`
* `ariaLabel`: `string` **(Required)**
* `icon`: `ReactNode`
* `isDisabled`: `boolean`

#### Variants & Sizes

* **Sizes:**
* `sm`: `h-8 w-8 p-1.5`
* `md`: `h-10 w-10 p-2`
* `lg`: `h-12 w-12 p-2.5`



#### Accessibility Requirements

* **MUST** take `ariaLabel` prop which passes directly to `aria-label`.
* Screen readers must be able to announce the action without visible text.

#### Do / Don't Guidelines

* **Do:** Ensure `ariaLabel` clearly describes the action (e.g., `ariaLabel="Close modal"`).
* **Don't:** Omit `ariaLabel` on icon-only buttons under any circumstances.

---

### 3.3 Input

#### Purpose

Captures single-line textual data from users.

#### Props

* `label`: `string`
* `error`: `string`
* `helperText`: `string`
* `leftIcon`: `ReactNode`
* `rightIcon`: `ReactNode`
* `isFullWidth`: `boolean`
* Standard HTML `<input>` attributes (`value`, `onChange`, `placeholder`, `type`, etc.)

#### States & Styles

* **Base:** `h-10 w-full rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-body-md placeholder:text-neutral-400`
* **Focus:** `focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500`
* **Error:** `border-error-500 focus:border-error-500 focus:ring-error-500`
* **Disabled:** `bg-neutral-100 text-neutral-400 cursor-not-allowed`

#### Accessibility Requirements

* Programmatically associates `<label>` with `<input>` using auto-generated `id`/`htmlFor`.
* If `error` is present, appends `aria-invalid="true"` and `aria-describedby="{inputId}-error"`.

---

### 3.4 Textarea

#### Purpose

Captures multi-line text input (e.g., delivery notes, customer message).

#### Props

* `label`: `string`
* `error`: `string`
* `rows`: `number` (Default: `4`)
* Standard HTML `<textarea>` attributes.

#### Accessibility Requirements

* Same auto-linking label and ARIA error attribution rules as `Input`.

---

### 3.5 Select

#### Purpose

Enables users to select a single option from an option menu.

#### Props

* `options`: `Array<{ value: string; label: string; disabled?: boolean }>`
* `value`: `string`
* `onChange`: `(value: string) => void`
* `placeholder`: `string`
* `label`: `string`
* `error`: `string`

#### Accessibility Requirements

* Keyboard accessible via `ArrowUp`/`ArrowDown`, `Enter`, and `Escape`.
* Implements `role="combobox"` or standard accessible custom select wrapper.

---

### 3.6 Checkbox

#### Purpose

Allows selection of one or multiple boolean values.

#### Props

* `checked`: `boolean`
* `onChange`: `(checked: boolean) => void`
* `label`: `ReactNode`
* `isDisabled`: `boolean`
* `error`: `string`

#### Accessibility Requirements

* Uses native `<input type="checkbox">` visually hidden or Radix Checkbox primitive with `role="checkbox"`.
* Linked label click toggles state.

---

### 3.7 Radio & Radio Group

#### Purpose

Allows single selection from a mutually exclusive set of options.

#### Props (RadioGroup)

* `value`: `string`
* `onChange`: `(value: string) => void`
* `name`: `string`
* `options`: `Array<{ value: string; label: string; description?: string }>`

---

### 3.8 Switch

#### Purpose

Toggles a binary setting on or off immediately.

#### Props

* `checked`: `boolean`
* `onChange`: `(checked: boolean) => void`
* `label`: `string`
* `isDisabled`: `boolean`

#### Accessibility Requirements

* Uses `role="switch"` and `aria-checked={checked}`.

---

### 3.9 Badge

#### Purpose

Displays short metadata, count, or status pill.

#### Props

* `variant`: `'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'`
* `size`: `'sm' | 'md'`
* `children`: `ReactNode`

#### Sizes & Styles

* `sm`: `px-2 py-0.5 text-caption font-semibold rounded-full`
* `md`: `px-2.5 py-1 text-body-sm font-semibold rounded-full`

---

### 3.10 Chip

#### Purpose

Interactive tags used for active filter selections or removable criteria.

#### Props

* `label`: `string`
* `onRemove`: `() => void`
* `isSelected`: `boolean`

---

### 3.11 Avatar

#### Purpose

Represents a user profile with an image or fallback initials.

#### Props

* `src`: `string`
* `alt`: `string`
* `fallback`: `string` (e.g., Initials "MT")
* `size`: `'sm' | 'md' | 'lg' | 'xl'`

#### Sizes

* `sm`: `h-8 w-8 text-caption`
* `md`: `h-10 w-10 text-body-sm`
* `lg`: `h-12 w-12 text-body-md`
* `xl`: `h-16 w-16 text-h4`

---

### 3.12 Card

#### Purpose

Surface block container to group related information and product context.

#### Props

* `variant`: `'elevated' | 'bordered' | 'flat'`
* `padding`: `'none' | 'sm' | 'md' | 'lg'`
* `children`: `ReactNode`

#### Variants

* **Elevated:** `bg-neutral-0 shadow-md rounded-lg border border-neutral-100`
* **Bordered:** `bg-neutral-0 border border-neutral-200 rounded-lg`
* **Flat:** `bg-neutral-50 rounded-lg`

---

### 3.13 Modal

#### Purpose

Focus-trapped overlay window for critical tasks or confirmation steps.

#### Props

* `isOpen`: `boolean`
* `onClose`: `() => void`
* `title`: `string`
* `description`: `string`
* `children`: `ReactNode`
* `size`: `'sm' | 'md' | 'lg' | 'full'`

#### Accessibility Requirements

* `aria-modal="true"`, `role="dialog"`.
* Focus trapped inside modal when active; restores focus to trigger element on close.
* Pressing `Escape` triggers `onClose`.

---

### 3.14 Drawer

#### Purpose

Slide-over modal panel anchored to the viewport edge (used for Mobile Navigation, Cart preview).

#### Props

* `isOpen`: `boolean`
* `onClose`: `() => void`
* `position`: `'left' | 'right'`
* `children`: `ReactNode`

---

### 3.15 Tooltip

#### Purpose

Provides contextual hint text on element hover or focus.

#### Props

* `content`: `string`
* `children`: `ReactElement`
* `position`: `'top' | 'bottom' | 'left' | 'right'`

---

### 3.16 Dropdown (Menu)

#### Purpose

Floating menu displaying contextual actions or options.

#### Props

* `trigger`: `ReactNode`
* `items`: `Array<{ id: string; label: string; icon?: ReactNode; onClick: () => void; isDanger?: boolean }>`

---

### 3.17 Navbar

#### Purpose

Main top-level header component providing primary brand navigation, search bar toggle, wishlist link, and cart drawer trigger. Strictly English-only layout (LTR).

#### Composition Rules

* Contains Logo (`Serif`), Navigation Links, Search Input / Action, Account Action, Cart Icon with Count Badge.
* Sticky position: `sticky top-0 z-navbar bg-neutral-0/90 backdrop-blur-md border-b border-neutral-100`.

---

### 3.18 Footer

#### Purpose

Global site footer containing store policy links, brand message, newsletter sign-up, and copyright information. Strictly English-only (LTR).

---

### 3.19 Product Card

#### Purpose

Primary visual component in category grids displaying perfume image, brand name, perfume name, fragrance concentration, price, and instant 'Add to Cart' action.

#### Props

* `id`: `string`
* `slug`: `string`
* `title`: `string`
* `brand`: `string`
* `price`: `number`
* `originalPrice`: `number` (optional, for sale display)
* `imageUrl`: `string`
* `gender`: `'Men' | 'Women' | 'Unisex'`
* `onAddToCart`: `() => void`
* `onToggleWishlist`: `() => void`
* `isInWishlist`: `boolean`

#### Layout & Tokens

* Aspect ratio for perfume bottle image: `aspect-[3/4] object-cover rounded-md bg-neutral-50`.
* Hover behavior: Subtle image zoom (`group-hover:scale-105 duration-normal ease-standard`).

---

### 3.20 Search Input & Overlay

#### Purpose

Global live product search input with instant results dropdown menu.

---

### 3.21 Pagination

#### Purpose

Controls navigation across multi-page catalog listings.

#### Props

* `currentPage`: `number`
* `totalPages`: `number`
* `onPageChange`: `(page: number) => void`

---

### 3.22 Breadcrumb

#### Purpose

Provides structural hierarchy navigation path (e.g., Home / Perfumes / Unisex / Royal Oud).

---

### 3.23 Tabs

#### Purpose

Organizes view contents into selectable pane sections (e.g., Product Description / Fragrance Notes / Shipping Details).

---

### 3.24 Accordion

#### Purpose

Vertically stacked collapsible headers used for FAQs and layered Filter groups.

---

### 3.25 Skeleton

#### Purpose

Animated shimmer placeholder shape indicating loading state for UI blocks.

#### Styles

* `animate-pulse bg-neutral-200 rounded-md`

---

### 3.26 Spinner

#### Purpose

Indicates an active asynchronous action or loading state.

#### Styles

* `animate-spin text-primary-500` SVG element.

---

### 3.27 Toast

#### Purpose

Non-blocking feedback message notification popping up on action success/error.

#### Variants

* `success`, `error`, `info`, `warning`.

---

## 4. Layout System

### 4.1 Containers

* Default max-widths bounded per breakpoint:
* `sm`: `640px`
* `md`: `768px`
* `lg`: `1024px`
* `xl`: `1280px`
* `2xl`: `1440px` (Max luxury content bound)



### 4.2 Grid System

* Standard Catalog Grid:
* Mobile: 1 column (`grid-cols-1`)
* Tablet: 2 or 3 columns (`md:grid-cols-2 lg:grid-cols-3`)
* Desktop: 4 columns (`xl:grid-cols-4`)


* Standard Gap: `gap-6` (24px) or `gap-8` (32px).

### 4.3 Section Spacing

* Vertical spacing between major page sections:
* Mobile: `py-12` (48px)
* Desktop: `py-20` (80px) or `py-24` (96px)



### 4.4 Page Templates

1. **Catalog Page Template:** Header → Breadcrumb → Two-column layout (Sidebar Filter 25% + Product Grid 75%) → Pagination → Footer.
2. **Product Detail Page (PDP) Template:** Header → Breadcrumb → Top section (50% Gallery + 50% Purchase Block) → Tabs (Notes/Details) → Related Products Slider → Footer.
3. **Checkout Layout Template:** Minimal Header (Logo only, no distractions) → 2-Column Split (Form inputs 60% + Order Summary 40%) → Secure Footer.

---

## 5. Animation Guidelines

### 5.1 Integration Principles (Framer Motion + React Bits)

* Framer Motion must be used exclusively for **layout transitions, modal entry/exits, drawer slide-overs, and page route changes**.
* CSS transitions via Tailwind classes must be used for simple hover, active press, and color transitions.
* React Bits decorative animations (e.g., background subtle particles, luxury glow effects) must be isolated to client components and non-blocking for interactivity.

### 5.2 Reduced Motion Compliance (Mandatory)

Every motion component **MUST** respect the user's `prefers-reduced-motion` browser setting.

```typescript
import { useReducedMotion } from 'framer-motion';

// Example inside component:
const shouldReduceMotion = useReducedMotion();

const animationVariants = {
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  visible: { opacity: 1, y: 0 },
};

```

---

## 6. Developer Rules for AI & Human Contributors

1. **Strict English-Only Enforced:** No i18n abstractions (`t()`), no locale routing (`/en/...`), no language switchers, and no RTL class helpers (`rtl:`). All UI strings are standard English string literals.
2. **Never Use Raw Magic Values:** Colors, spacings, font sizes, and z-indices must use design token classes (`bg-primary-500`, `z-modal`) rather than arbitrary inline styles or arbitrary tailwind brackets (e.g., avoid `z-[999]` or `bg-[#123456]`).
3. **No Business Logic in UI Components:** Shared design system components in `src/components/ui/` must remain pure presentation components. Business state (API calls, TanStack Query hooks, cart calculations) belongs strictly in feature modules or container hooks.
4. **Mandatory Type Definitions:** Every shared component must explicitly export its `Props` interface matching naming pattern `ComponentNameProps`.
5. **Strict Accessibility Compliance:** Interactive components without visible text **MUST** enforce accessible labeling (`aria-label` or `aria-labelledby`).
6. **Class Merging Mandate:** All layout and component wrapper nodes must accept a `className?: string` prop and merge it using `cn(baseStyles, className)`.