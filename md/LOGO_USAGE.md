# LOGO_USAGE.md

**Project:** KENZ — Premium Multi-Brand Fragrance Marketplace

**Scope:** Developer / Implementation Usage Guide — Final Approved Logo Package

**Status:** OFFICIAL & FROZEN — SINGLE SOURCE OF TRUTH FOR ASSETS

**Companion Documents:** `LOGO_SPEC.md` (full specification and rationale), `LOGO_CONCEPT.md` (design rationale), `BRAND_GUIDELINES.md` §9 (brand-level logo direction)

> **Final asset notice:** This document describes the logo package actually delivered and approved (`KENZ-react-vite-assets.zip`). It supersedes any prior usage guidance, exploratory direction, or asset list in the companion documents. If anything in `LOGO_SPEC.md` or `LOGO_CONCEPT.md` conflicts with this document or with the delivered files, the delivered files and this document govern.

---

## 1. What was delivered

| File | Purpose |
|---|---|
| `logo-primary.svg` / `.png` | Full horizontal lockup (icon + "KENZ" wordmark), near-black, transparent background. Default asset for light backgrounds. |
| `logo-light.svg` / `.png` | Full horizontal lockup, near-black, transparent background. Visually identical construction to `logo-primary` — provided as a distinctly named asset for contexts that call for it explicitly (see Section 5). |
| `logo-dark.svg` / `.png` | Full horizontal lockup, white mark on a solid near-black background baked into the file. Self-contained tile for direct placement on any surface without needing a separately dark-colored background. |
| `logo-icon.svg` / `.png` | Icon-only mark (no wordmark), near-black, transparent background, square canvas. |
| `favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png` | Browser favicon set, icon-only mark. |
| `apple-touch-icon.png` (180×180) | iOS home-screen icon. |
| `android-chrome-192.png`, `android-chrome-512.png` | Android/PWA icons, referenced by `site.webmanifest`. |
| `site.webmanifest` | PWA manifest (`theme_color: #1D1D1B`, `background_color: #F8F7F3`). |

**Not included in this package:** a vertical/stacked lockup, a gold-fill logo variant, a physical/embossed "seal" variant, mockups, stationery, social assets, or presentation files. Do not assume any of these exist — see `LOGO_SPEC.md` §3 for how each is now marked.

---

## 2. Brand mark

KENZ uses a solid, geometric monogram **K** — a vertical spine, a horizontal notch, and two diagonal arms meeting at a single point — rendered as one flat-filled shape with hard, right-angle cuts. There are no curves, no rounded terminals, no open/hairline strokes, and no internal subdivision lines. The wordmark "KENZ" is set in a serif typeface (Georgia / Times New Roman stack), full capitals, with wide letter-spacing, on a single baseline beside the icon.

Full design rationale lives in `LOGO_CONCEPT.md`; full construction/geometry detail lives in `LOGO_SPEC.md`.

---

## 3. Color usage

| Color | Value | Recommended use |
|---|---|---|
| Near Black | `#1D1D1B` | Primary logo, wordmark, icons, on light backgrounds |
| White | `#FFFFFF` | Reversed logo on near-black or other sufficiently dark backgrounds |
| Warm White | `#F8F7F3` | Preferred light interface background behind the logo |
| Champagne Gold | `#C8A55A` | Optional, restrained accent only — **never** the logo's own fill color |

The standard production logo is near-black. The white version is reserved for dark backgrounds. Do not apply gradients, shadows, textures, bevels, or 3D effects to any variant.

---

## 4. Minimum size

- **Full horizontal logo (digital):** no smaller than **120px wide**.
- **Icon-only mark:** usable down to **16px** as a favicon; **24px or larger** preferred for ordinary interface use (nav bars, avatars, etc.).
- At any size, preserve the original proportions exactly. Do not redraw, simplify, or manually "clean up" the mark at small sizes without design approval.

---

## 5. Clear space

- **Full lockup (icon + wordmark):** clear space on all four sides equal to the height of the monogram's vertical spine.
- **Icon-only mark:** clear space on all four sides equal to one quarter of the icon's height.
- No navigation element, image, border, or other mark may enter this protected area.

---

## 6. Background & file-selection rules

| Situation | File to use |
|---|---|
| Warm white, white, or light neutral background | `logo-primary.svg` / `.png` |
| Dark solid background | `logo-dark.svg` / `.png` |
| Light background, full name + mark explicitly required | `logo-light.svg` / `.png` |
| Small square placement, mark only | `logo-icon.svg` / `.png` |
| Browser tab / OS / PWA icons | The favicon and manifest files as a set |

Use the logo only on calm, low-contrast backgrounds. Avoid busy photography, gradients, patterns, or low-contrast colors behind it. The white version (`logo-dark.svg`, which carries its own dark background) should appear only where the mark and wordmark remain clearly legible.

---

## 7. Accessibility

- Every SVG carries a semantic `role="img"` and `aria-label` (`"KENZ logo"` / `"KENZ icon"`) so the mark is announced correctly by assistive technology when embedded inline.
- Contrast: near-black (`#1D1D1B`) on warm white (`#F8F7F3`) and white (`#FFFFFF`) on near-black both clear WCAG 2.1 AA contrast requirements for graphical objects. Do not substitute the gold accent as the logo's own fill — gold-on-white and gold-on-near-black both sit below the contrast levels the mark relies on for legibility at small sizes.
- Do not convey brand meaning through color alone in any UI element adjacent to the logo (e.g., status badges) — this is a general product rule, not specific to the mark itself, but the logo's own restricted palette (Section 3) exists in part to keep this easy to uphold.

---

## 8. Do's and Don'ts

**Do:**
- Preserve the supplied proportions exactly.
- Use the correct light or dark variant for the background it sits on.
- Maintain clear space (Section 5).
- Keep the mark flat and precise — solid fill, no effects.
- Use SVG wherever the implementation supports it, especially for responsive layouts and high-DPI displays.

**Don't:**
- Stretch, compress, rotate, outline, recolor, or crop the mark.
- Add drop shadows, glows, bevels, gradients, or any 3D effect.
- Add a border around the logo.
- Change or restyle the serif wordmark.
- Separate the icon and wordmark within the full lockup unless the placement specifically calls for `logo-icon` alone.
- Place the logo inside a crown, shield, seal, diamond, bottle, or any decorative emblem.
- Use champagne gold as the logo's own fill color.

---

## 9. Implementation notes (React / Vite)

- Default light-background header/nav: `logo-primary.svg`.
- Dark navigation bar or footer: `logo-dark.svg`.
- Compact/square UI contexts (mobile nav collapsed state, avatar-style placement): `logo-icon.svg`.
- Use the PNG equivalents only when a raster-only integration point requires them (e.g., an `<img>` source with no SVG support, or an export pipeline that flattens vector assets).
- `favicon.svg` covers browsers with SVG favicon support; the ICO/PNG/Apple/Android files in the package provide the fallback and platform-specific set — wire all of them via the manifest and `<link>` tags, don't cherry-pick.

---

## 10. Production note

This package contains only the requested production assets and this usage document. It does not include mockups, stationery, social assets, presentations, or any additional branding files. Do not treat absence from this list as an oversight — it is scope, not a gap to fill in.

---

*End of LOGO_USAGE.md*