# ARCHITECTURE SPECIFICATION DOCUMENT

**Project:** KENZ — Premium Multi-Brand Fragrance Marketplace

**Scope:** Complete Front-End & Application Architecture Blueprint

**Status:** OFFICIAL & FROZEN — SINGLE SOURCE OF TRUTH (English-Only)

**Target Stack:** React + Tailwind CSS + TypeScript | NestJS + MongoDB + REST API

---

## 1. Project Vision

KENZ is a high-end e-commerce platform crafted to deliver an opulent, frictionless, and immersive digital shopping experience for curated, luxury fragrances from the world's finest designer and niche perfume houses. The platform combines elegant visual design with robust, enterprise-grade application architecture to showcase premium products, streamline user journeys, and empower store administrators with complete catalog, inventory, and order control.

---

## 2. Design Philosophy

The front-end design philosophy centers around **Minimalist Elegance & Editorial Sophistication**. It balances high-fashion aesthetics with digital usability:

* **Generous White Space & Airiness:** Uncluttered layouts prioritize high-resolution imagery and product narratives over dense UI elements.
* **Content-Centric Hierarchy:** Visual focus remains anchored on perfume craftsmanship, notes, and visual storytelling.
* **Deterministic Interaction:** UI interactions respond predictably without gratuitous animations, instilling confidence and security.
* **English-Exclusive Tone:** The copy, interface, and typography reflect refined, classic luxury designed for an English-speaking audience.

---

## 3. Brand Identity

* **Personality:** High-end, exclusive, authoritative, refined, and timeless.
* **Visual Aesthetic:** Editorial typography paired with deep, grounding monochromatic neutrals and metallic accent highlights.
* **Imagery Style:** High-contrast studio product shots, macro liquid textures, clean editorial lookbooks, and subtle glass transparency effects.

---

## 4. Color System

The color palette uses semantic CSS variables and mapped Tailwind tokens:

### 4.1 Primary & Neutral Tokens

* **Canvas Dark / Noir:** `#0F0F11` (Primary dark background, dark mode surfaces, high-contrast text)
* **Off-White / Soft Silk:** `#FA9A8` / `#FBF9F5` (Primary canvas background for light mode)
* **Neutral Slate / Charcoal:** `#1F1F23` / `#2D2D32` (Card borders, secondary headers)
* **Muted Muted Neutral:** `#71717A` (Secondary text, subtitles, placeholders)

### 4.2 Metallic Accent Tokens

* **Luxury Gold (Primary Accent):** `#D4AF37`
* **Warm Gold Highlight:** `#E5C158`
* **Subtle Silver / Platinum:** `#E5E7EB`

### 4.3 System & Feedback Tokens

* **Success / In-Stock:** `#10B981` (Subtle emerald)
* **Warning / Low Stock:** `#F59E0B` (Muted amber)
* **Error / Destructive:** `#EF4444` (Refined crimson)
* **Info / Status Note:** `#3B82F6` (Muted sapphire)

---

## 5. Typography System

A dual-type hierarchy pairs editorial serif displays with ultra-legible sans-serif body typography.

### 5.1 Typefaces

* **Display / Headings:** *Cormorant Garamond* / *Playfair Display* (Serif — elegance, luxury headers)
* **Body / Interface / Form Controls:** *Inter* / *Plus Jakarta Sans* (Sans-Serif — clarity, interface elements, tabular data)

### 5.2 Type Scale

| Token | Size | Line Height | Tracking | Application |
| --- | --- | --- | --- | --- |
| `display-xl` | 3.75rem (60px) | 1.1 | `-0.02em` | Main Hero Headline |
| `display-lg` | 3.00rem (48px) | 1.15 | `-0.01em` | Page Headings, Brand Spotlights |
| `h1` | 2.25rem (36px) | 1.2 | `0.00em` | Section Titles, Product Titles |
| `h2` | 1.75rem (28px) | 1.25 | `0.00em` | Subsections, Drawer Titles |
| `h3` | 1.25rem (20px) | 1.3 | `0.01em` | Product Cards, Modal Headers |
| `body-lg` | 1.125rem (18px) | 1.6 | `0.00em` | Editorial Descriptions |
| `body-md` | 1.00rem (16px) | 1.5 | `0.00em` | Primary Body Text, Form Labels |
| `body-sm` | 0.875rem (14px) | 1.4 | `0.01em` | Metadata, Secondary Information |
| `caption` | 0.75rem (12px) | 1.3 | `0.05em (UPPERCASE)` | Badges, Scent Notes, Micro-copy |

---

## 6. Spacing & Layout System

* **Grid Basis:** 4px baseline grid (`rem` based).
* **Grid Columns:** 12-column layout on desktop (`lg`/`xl`), 8-column on tablet (`md`), 4-column on mobile (`sm`).
* **Container Max Widths:**
* Catalog / Standard pages: `1280px` (`max-w-7xl`)
* Editorial / Checkout pages: `1024px` (`max-w-5xl`)
* Auth / Form focus pages: `480px` (`max-w-md`)


* **Spacing Scale:**
* Micro: `4px` (`space-1`), `8px` (`space-2`), `12px` (`space-3`), `16px` (`space-4`)
* Layout: `24px` (`space-6`), `32px` (`space-8`), `48px` (`space-12`), `64px` (`space-16`), `96px` (`space-24`)



---

## 7. Motion System

Animations are restrained, performant, and accessible (`prefers-reduced-motion` supported).

* **Durations:**
* Micro-interactions (Button hover, checkbox toggle): `150ms`
* Layout transitions (Modals, drawers, dropdowns): `250ms - 300ms`
* Page route fades / Hero reveals: `400ms`


* **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Custom subtle ease-out deceleration curve).
* **Transforms:** Restricted to GPU-accelerated properties (`opacity`, `transform: translate`, `scale`).

---

## 8. Component Philosophy

All front-end UI components strictly follow **Atomic Design Principles** with custom React + Tailwind wrapper abstractions:

* **Atoms:** Buttons, Form Inputs, Badges, Icons, Micro-spinners, Tooltips.
* **Molecules:** Form Groups, Product Card Tile, Search Input with Dropdown, Cart Line Item.
* **Organisms:** Navigation Bar, Header Hero, Product Details Grid, Order Summary Panel, Footer.
* **Templates & Pages:** Auth Layout, Shop Catalog Layout, Single Product Layout, Checkout Flow Layout, Admin Dashboard Layout.
* **Encapsulation:** Components must remain strictly functional, stateless where feasible, typed with TypeScript interfaces, and decoupled from global business state using custom hooks.

---

## 9. Accessibility Standards (WCAG 2.1 AA)

* **Color Contrast:** Minimum 4.5:1 text-to-background contrast ratio across standard elements; 3:1 for large display headers.
* **Keyboard Navigation:** Full focus-trap capability on open modals/drawers, visible focus outlines (`ring-2 ring-gold-500 ring-offset-2`).
* **ARIA Attributes:** Explicit use of `aria-expanded`, `aria-controls`, `aria-live` for dynamic cart updaters, and screen-reader accessible label overlays.
* **Form Accessibility:** Explicit labels (`htmlFor`), inline aria-describedby field error messaging.

---

## 10. Application Architecture

* **Framework:** React + TypeScript (Vite / Next.js SPA/App Router setup).
* **Styling Engine:** Tailwind CSS with utility-first tokens mapped to custom CSS properties.
* **State Management:**
* **Server State:** TanStack Query (React Query) for API fetching, caching, automatic revalidation, and optimistic updates.
* **Client / UI State:** React Context / Zustand for lightweight local UI state (Sidebar drawer toggles, modal triggers, search overlay state).
* **Form State:** React Hook Form + Zod for schema-driven client-side payload validation.


* **API Integration Layer:** Axios / Fetch instance with pre-configured request/response interceptors for automatic JWT Bearer token attachment and unified API error handling.

---

## 11. User Roles & Permissions

* **Customer:**
* Register, Login, Manage Profile, Add/Edit Addresses.
* Browse Catalog, Search, Filter by Category, Brand, Gender, Price.
* Manage Cart, Wishlist, Checkout, View Own Order History.


* **Admin:**
* Full administrative access to manage Products, Categories, Brands, Inventory.
* View all customer orders and update shipping/fulfillment statuses.
* Access high-level sales overview metrics.



---

## 12. AI Architecture

Guidance for AI Coding Assistants working on this codebase:

* **Source of Truth Enforcement:** AI tools must adhere strictly to `AI_RULES.md` (Parts 1–3) and this Architecture Specification.
* **Code Conventions:**
* Strict TypeScript (no implicit `any`).
* File naming in `kebab-case` (`product-card.tsx`, `use-cart.ts`).
* Explicit modular separation (Keep business logic in custom hooks; UI in pure functional components).


* **Modification Limits:** AI assistants must not unilaterally modify global configuration, dependency trees, database schema definitions, or core architecture without explicit user authorization.

---

## 13. Navigation Architecture

* **Primary Navigation Header:**
* Brand Logo (Centered / Left)
* Direct Nav Links: *New Arrivals*, *Perfumes* (Catalog), *Categories*, *Brands*, *Our Story*
* Utility Controls: Search Icon (Triggers Search Modal), User Account Menu / Login Trigger, Wishlist Counter Icon, Cart Drawer Trigger (with Item Badge).


* **Footer Navigation:**
* Brand Heritage Brief
* Quick Links: Catalog, FAQ, Shipping & Returns, Contact Us, Terms of Service, Privacy Policy.
* Social & Newsletter Signup.



*(Note: English-only UI. No language switcher, RTL toggle, or locale selection elements present.)*

---

## 14. Responsive Strategy

* **Breakpoints:**
* `sm`: `640px` (Mobile landscape / large phones)
* `md`: `768px` (Tablets / Portrait iPads)
* `lg`: `1024px` (Small laptops / Tablet landscape)
* `xl`: `1280px` (Desktop / standard monitors)
* `2xl`: `1536px` (Wide desktop displays)


* **Mobile First Paradigm:** Default Tailwind utilities target mobile views, scaled progressively via `md:`, `lg:`, and `xl:` variants.
* **Touch Targets:** Minimum touch hit box of `44x44px` on screen targets for mobile viewports.

---

## 15. Screen States

Every data-driven page and UI component must support 5 standard deterministic states:

1. **Initial / Idle State:** Base presentation before data fetching occurs.
2. **Loading State:** Skeleton loaders matching exact component shapes (no sudden layout shifts).
3. **Success / Populated State:** Complete display of populated data.
4. **Empty State:** Clean visual feedback when query results are empty (e.g., "No fragrances found matching your selected filters").
5. **Error State:** User-friendly error message cards with clear retry action triggers (`Try Again` CTA).

---

## 16. Dynamic Content Strategy

* **Product Badges:** Dynamic tags (*New*, *Bestseller*, *Limited Edition*, *Out of Stock*).
* **Inventory Alerts:** Dynamic urgency messaging (*Only 2 bottles remaining*) triggered directly from real-time stock thresholds.
* **Cart Summaries:** Live auto-calculated subtotals, estimated taxes, and shipping thresholds.
* **Scent Pyramids:** Structured visual representation of perfume notes (*Top Notes*, *Heart Notes*, *Base Notes*).

---

## 17. SEO Strategy

* **Single-Locale Metadata:** Optimized solely for English (`en-US`) indexing.
* **Dynamic Title & Meta Tags:** Page-specific titles (`[Product Name] — KENZ`).
* **Open Graph & Twitter Cards:** Pre-formatted social sharing images, product title, and description tags.
* **Structured Data (JSON-LD):** Semantic Schema.org markup for `Product`, `Offer`, `BreadcrumbList`, and `Organization` to support rich Google search snippets.
* **Clean URLs:** Human-readable kebab-case slugs (`/products/royal-oud-eau-de-parfum`).

---

## 18. Future Expansion

Architectural hooks reserved for future expansion without refactoring core code:

* **Coupons & Discount Engine:** Schema-ready price calculation hooks.
* **Reviews & Ratings Module:** Dedicated UI slot on the Product Detail Page and backend schema reservation.
* **Payment Gateway Integration:** Payment step in the checkout flow cleanly decoupled to inject providers (Stripe, PayPal, etc.).
* **Push & Email Notifications:** Event-ready triggers on order status updates.

---

## 19. Architecture Principles

1. **Separation of Concerns:** Presentation UI, Application State, and API Data Fetching reside in distinct layer boundaries.
2. **KISS & YAGNI:** Avoid over-engineering, unneeded micro-frontends, or unnecessary abstractions until explicitly required.
3. **Predictable State Flow:** One-way data flow via standard React state patterns and TanStack Query caching.
4. **Resilience & Graceful Degradation:** The application fails gracefully with error boundaries and non-blocking toast notifications.

---

## 20. Final Frozen Decisions

* **Locale Scope:** Strictly **English-Only** (`en-US`, LTR). All multi-language support, i18n infrastructure, RTL layouts, language switchers, and locale routing are permanently removed.
* **Architecture Freeze Status:** The Front-End & Application Architecture is officially **FROZEN**.
* **Next Active Phase:** Phase 1 — Complete Design System Documentation & Tailwind Implementation Guidelines.