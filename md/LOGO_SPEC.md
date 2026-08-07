# LOGO_SPEC.md

**Project:** KENZ — Premium Multi-Brand Fragrance Marketplace

**Scope:** Official Logo & Mark Specification

**Status:** OFFICIAL & FROZEN — SINGLE SOURCE OF TRUTH

**Companion Documents:** `BRAND_GUIDELINES.md` (brand strategy & voice), `LOGO_CONCEPT.md` (design rationale for the approved mark), `LOGO_USAGE.md` (developer/implementation usage guide), `Design_System.md` (design tokens & components)

> **Final asset notice:** This specification has been revised to match the final approved logo package (`KENZ-react-vite-assets.zip`). It previously described an unbuilt exploratory direction (an open-counter "Facet Mark" with internal gem-cut subdivision lines, plus several variants — a vertical lockup, a Gold-fill version, a physical "Facet Seal" — that were never produced). That earlier direction is superseded in full. Every rule below now reflects the mark, wordmark, colors, and file set that were actually delivered and approved.

---

## 1. Brand Position

**KENZ** — Arabic for **"Treasure"** — is a curated, premium marketplace for the world's finest designer and niche perfume houses. It does not manufacture fragrance. The logo must never suggest otherwise.

### 1.1 What the mark must communicate

| Attribute | Meaning for the Logo |
|---|---|
| **Curation** | A small number of exact, deliberate elements — one shape, one wordmark, never a busy composite. |
| **Precision** | Every line and angle in the mark is straight and deliberate — cut, not sketched. |
| **Luxury** | The mark reads as considered at a glance, appropriate on a hangtag, invoice, or app icon alike. |
| **Timelessness** | No trend-driven geometry, no gradient, no currently-fashionable effect. |
| **Collection** | The identity represents a gathering of treasures — never a single fragrance, bottle, or scent family. |

### 1.2 What the mark must never communicate

- **Flashy** — no neon, no "look at me" scale or angle.
- **Playful** — no rounded/bubbly letterforms, no mascot.
- **Colorful** — the mark exists in its restricted near-monochrome-plus-gold-accent system only (Section 5).
- **Trendy** — no gradient meshes, no glassmorphism.
- **A fragrance product** — under no circumstance may the mark depict, abstract, or gesture toward a bottle, cap, atomizer, spray, droplet, or flower (Section 10).

---

## 2. The Approved Mark

The identity is a **solid geometric K monogram**: a vertical spine, a horizontal notch, and two diagonal arms meeting at a single point, built entirely from straight lines and right-angle cuts. There is no curve, no open hairline construction, and no internal subdivision of the counter. Full construction and rationale are documented in `LOGO_CONCEPT.md`.

The wordmark "KENZ" is set in a serif face (`Georgia, "Times New Roman", serif`), full capitals, wide letter-spacing, on a single baseline.

---

## 3. Logo Variants — Delivered vs. Not Delivered

Every variant below reflects the actual file set in the approved package. Nothing outside this list exists and nothing should be fabricated to fill a gap.

| Variant | File(s) | Status |
|---|---|---|
| Full horizontal lockup, near-black, transparent — light backgrounds | `logo-primary.svg` / `.png` | **Delivered** |
| Full horizontal lockup, near-black, transparent — light backgrounds, explicit full-name contexts | `logo-light.svg` / `.png` | **Delivered** (construction identical to `logo-primary`) |
| Full horizontal lockup, white mark on a baked-in near-black background | `logo-dark.svg` / `.png` | **Delivered** |
| Icon-only mark, near-black, transparent, square canvas | `logo-icon.svg` / `.png` | **Delivered** |
| Favicon set (SVG, ICO, 16px, 32px) | `favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png` | **Delivered** |
| iOS home-screen icon | `apple-touch-icon.png` (180×180) | **Delivered** |
| Android/PWA icons | `android-chrome-192.png`, `android-chrome-512.png` | **Delivered** |
| PWA manifest | `site.webmanifest` | **Delivered** |
| Vertical / stacked lockup | — | **Not delivered.** Do not construct one; use `logo-icon.svg` alone for square/portrait placements. |
| Gold-fill logo variant | — | **Not delivered.** Gold is an accent only (Section 5) — never the logo's own fill. |
| Physical / embossed "Facet Seal" variant | — | **Not delivered / concept dropped.** No enclosed-border variant of the mark exists or is authorized. |

**Rule governing all delivered variants:** color is the only thing that changes between `logo-primary`, `logo-light`, and `logo-dark`. Proportions, letter-spacing, and geometry are identical across all three.

---

## 4. Typography

- **Wordmark typeface (as delivered):** `Georgia, "Times New Roman", serif`. This is the exact font-family stack embedded in every SVG lockup file. It is a moderate-contrast serif, set in full capitals with wide, deliberate letter-spacing.
- **Relationship to the product UI heading font:** the UI's heading typeface elsewhere in the app is `Playfair Display` (`Design_System.md` §1.2). The logo's own wordmark typeface is fixed by the delivered asset and is not required to be, and currently is not, the same specific face. Treat the logo wordmark as a locked graphic element (outlined in the SVG path/text as delivered) rather than a live, restylable text string.
- **No italic, no script, no alternate weight** — the wordmark is set once, at one weight, in the delivered files.

---

## 5. Color Usage

**No colors exist for the logo outside the four values below.** These are fixed hex values baked into the delivered files — they are not the same as (though they are compatible in spirit with) the CSS custom-property token scale in `Design_System.md`.

| Value | Hex | Approved Use |
|---|---|---|
| Near Black | `#1D1D1B` | Primary mark, wordmark, and icon on light or transparent backgrounds |
| White | `#FFFFFF` | Reversed mark, used within `logo-dark.svg` on its baked-in near-black background |
| Warm White | `#F8F7F3` | Interface background behind the logo (also the PWA manifest background color) |
| Champagne Gold | `#C8A55A` | Restricted accent only — **never** the logo's own fill color |

### 5.1 Explicitly forbidden

- No gradient constructed from any combination of the above values.
- No opacity-reduced ("faded") logo fills — the logo is always rendered at full, solid opacity.
- No arbitrary hex value outside this table, regardless of how close it may appear.
- No drop shadow, glow, bevel, texture, or 3D effect on any variant.

---

## 6. Icon Concept — Resolution

Earlier exploration (documented historically, not currently authorized) considered several directions for the symbol: a geometric monogram K, a jewel-cut/facet mark, a vault/keyhole abstraction, and an architectural motif. The approved and delivered mark resolved to the **geometric monogram K** direction, built as a solid filled shape with no facet subdivisions, no vault/keyhole imagery, and no architectural framing device. See `LOGO_CONCEPT.md` for full rationale. No other icon direction is active or should be referenced as current.

---

## 7. Clear Space

- **Full lockup (icon + wordmark):** minimum clear space on all four sides equal to the height of the monogram's vertical spine.
- **Icon-only mark:** minimum clear space on all four sides equal to one quarter of the icon's height.
- Clear space is measured from the outermost point of the artwork. No other logo, text, navigation element, photograph, or graphic device may intrude into this margin — use a solid scrim/overlay behind the logo on busy backgrounds rather than tightening clear space.
- This rule applies identically across `logo-primary`, `logo-light`, and `logo-dark`.

---

## 8. Minimum Size

| Context | Minimum Size | Notes |
|---|---|---|
| **Full horizontal logo, digital** | **120px wide** | Below this width, legibility of the wordmark and the mark's straight-line precision begins to degrade. |
| **Icon-only mark, general UI** | **24px** preferred minimum | Usable smaller only where required (see favicon row). |
| **Icon-only mark, favicon** | **16px** | Uses `favicon-16.png` / `favicon.svg` directly — do not attempt to shrink `logo-icon.svg` further than the delivered favicon assets. |
| **App icons** | 180px (Apple), 192px / 512px (Android) | Use the delivered `apple-touch-icon.png` and `android-chrome-*.png` files directly; do not re-export from the primary lockup. |

**Rule:** if a placement requires a size smaller than these minimums, switch to a simpler/smaller delivered asset (e.g., full lockup → icon-only), never scale an existing file below its floor.

---

## 9. Usage Rules

| Surface | Approved Asset | Notes |
|---|---|---|
| Light or warm-white backgrounds | `logo-primary.svg` (or `logo-light.svg` where the full name is explicitly required) | Default, most common usage. |
| Dark solid backgrounds | `logo-dark.svg` | Self-contained — already includes its own near-black background fill; do not place it on top of another dark color expecting transparency. |
| Small square placements (compact nav, avatar-style slots) | `logo-icon.svg` | Never scale the icon down manually — use the dedicated favicon files for browser/OS contexts instead. |
| Browser tab / OS / PWA icons | Favicon set + `site.webmanifest` | Wire the full set (SVG, ICO, both PNG sizes, Apple and Android icons) rather than a subset. |
| Busy or photographic backgrounds | Not directly — add a solid scrim/overlay first | The logo's fixed two-color-per-variant system depends on flat, low-contrast surroundings for legibility. |

---

## 10. Don'ts

The following are absolute prohibitions and apply to every delivered variant.

**Fragrance-object prohibitions (highest priority):**
- No perfume bottle silhouettes, caps, atomizers, sprays, floral icons, droplets, or literal containers in any degree of abstraction.

**General prohibitions:**
- No gradients, drop shadows, glows, bevels, or textures.
- No stretching, skewing, condensing, expanding, or rotating the logo.
- No recoloring outside the four values in Section 5.
- No enclosing the mark in a crown, shield, seal, diamond, or decorative emblem.
- No fabricating a vertical/stacked lockup, a gold-fill variant, or a physical seal variant — none of these exist in the approved package (Section 3).
- No separating the icon and wordmark within the full lockup unless the placement specifically calls for the icon-only asset.
- No restyling, outlining, or re-kerning the wordmark — it is a locked graphic element in the delivered files, not live/restylable text.
- No placing the logo on a busy photographic background without a contrast-guaranteeing scrim.
- No reproducing the logo below the minimums in Section 8 — switch to a smaller approved asset instead.

---

## 11. Final Summary

KENZ's logo, as approved and delivered, is a solid geometric K monogram paired with a serif "KENZ" wordmark, rendered in a four-color-value system (near black, white, warm white background, restricted gold accent). Every asset in circulation is enumerated in Section 3; nothing outside that list is authorized, regardless of what earlier exploratory documentation described.

**The four things every contributor must remember:**

1. The delivered mark is a solid filled shape — no facets, no open hairline construction.
2. Only the files listed in Section 3 exist. No vertical lockup, gold-fill variant, or seal variant should be assumed or created.
3. Colors are fixed hex values (Section 5), not design-system tokens.
4. If a design decision isn't traceable to this document, `LOGO_CONCEPT.md`, or `LOGO_USAGE.md`, it does not belong in the mark.

---

*End of LOGO_SPEC.md*