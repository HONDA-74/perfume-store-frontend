# LOGO_CONCEPT.md

**Project:** KENZ — Premium Multi-Brand Fragrance Marketplace

**Scope:** Final Approved Logo Concept

**Status:** OFFICIAL & FROZEN — SINGLE SOURCE OF TRUTH

**Source Documents:** `BRAND_GUIDELINES.md` (brand identity & voice), `LOGO_SPEC.md` (logo rules & constraints), `LOGO_USAGE.md` (developer usage guide), `Design_System.md` (design tokens)

> **Revision notice:** This document previously described an exploratory "Facet Mark" direction — an open-counter monogram built from thin hairline strokes with internal gem-cut subdivision lines. That direction was **not** what was ultimately produced. The approved, delivered logo package (`KENZ-react-vite-assets.zip`) contains a different, simpler construction: a solid, flat-filled geometric K monogram with no internal subdivision lines and no open counter. This revision replaces the earlier description in full so that this document matches the actual delivered asset. No visual redesign has occurred as part of this revision — only the documentation has been corrected to describe what was approved and shipped.

---

## 1. Logo Rationale

The approved direction is a **geometric K monogram**: a single solid shape built from a vertical spine, a horizontal notch, and two diagonal arms that meet at one point, all cut with hard right angles. It reads simultaneously as the brand's initial and as a precise, architectural construction — no curves, no rounded terminals, no decorative flourish.

This direction serves the brief set in `LOGO_SPEC.md` §1 for three reasons:

1. **Instant, ownable initial recognition.** The K is immediately legible as the brand's first letter at any size, from a 1024px master down to a 16px favicon.
2. **Precision over ornament.** Every edge in the mark is a straight line meeting at a fixed angle — there is nothing to abstract or interpret. This keeps the mark in the "restraint and precision" register the brand requires (`BRAND_GUIDELINES.md` §5, `LOGO_SPEC.md` §1.1), without needing additional geometry (facets, subdivisions, or an enclosing border) to carry that meaning.
3. **It stays permanently clear of the mark's one absolute constraint.** A solid architectural K has no bottle, cap, atomizer, spray, droplet, or floral reading at any size or angle — the prohibition that governs every other decision in `LOGO_SPEC.md` §10.

**One-line rationale:** *A single letter, built from precise, deliberate cuts — nothing added, nothing implied.*

---

## 2. Wordmark Description

- **Content:** `KENZ`, full capitals, single baseline, set beside the icon in the horizontal lockup (`logo-primary.svg` / `logo-dark.svg` / `logo-light.svg`).
- **Typeface (as delivered):** a serif face from the `Georgia, "Times New Roman", serif` stack. This is the typeface actually embedded in the approved SVG/PNG lockups. It is a moderate-contrast serif with classical proportions — legible, restrained, and consistent with an editorial register, though it is a different specific face from the `Playfair Display` heading font used elsewhere in the product UI (`Design_System.md` §1.2). The two are not required to match; the logo's own typeface is fixed by the delivered files and is not the same asset as the UI's heading font stack.
- **Case:** full capitals, no subordinate article word — "KENZ" is set as a single confident unit.
- **Letter-spacing:** wide, deliberate tracking (materially wider than typical body-text tracking) — this is what gives the four-letter wordmark presence and keeps it from reading as a compressed acronym.
- **Weight:** a single static weight, unstyled — no bold, no italic, no mixed weights.
- **Baseline:** perfectly horizontal, no arcing, no rotation, no perspective.

---

## 3. Symbol Description

- **Form:** a solid, flat-filled monogram K. It is drawn as one continuous closed shape (a single SVG `<path>`), not as a stroked outline and not as multiple overlapping elements.
- **Construction:** a vertical spine on the left; a short horizontal notch roughly at mid-height; two diagonal arms extending from that notch and converging to a single point. Every segment is either perfectly horizontal, perfectly vertical, or a straight diagonal — there are no curves anywhere in the shape.
- **Negative space:** the counter (the space between the spine and the diagonal arms) is open — there is no enclosing circle, shield, or border around the mark, and no internal line subdivides that open space. This is a meaningful correction from earlier documentation: no "facet lines" exist inside the counter.
- **Fill, not stroke:** the mark is a filled shape at a bold, confident weight — not a thin hairline construction. It reads as solid and architectural rather than delicate or jewel-like.
- **Canvas placement (icon-only asset, `logo-icon.svg`, 1000×1000 viewBox):** the shape is not centered with uniform padding. It sits with roughly 12% clear margin on the left (beyond the spine) and roughly 9% margin top and bottom, while the diagonal arm tips extend to the right edge of the canvas. This asymmetry is part of the delivered geometry and should be preserved exactly — do not re-center or re-pad the icon.
- **What it must not become:** no curve, loop, or rounded terminal should ever be introduced into this shape; no enclosing circle, shield, or seal should be added around it; and no internal line should be added to suggest facets, cuts, or gem-like subdivision — none of that is present in the approved mark.

---

## 4. Visual Balance

- In the horizontal lockup, the icon occupies a fixed-proportion block at the left, vertically centered against the wordmark's cap-height, with a short fixed gap before the wordmark begins.
- The icon's bold, blocky weight is balanced by the wordmark's wide letter-spacing and moderate stroke contrast — the pairing avoids one element visually overpowering the other.
- The mark's converging diagonal point (the K's vertex) sits at the vertical midline of the icon, giving the whole lockup a stable, centered anchor rather than a top- or bottom-heavy silhouette.

---

## 5. Alternate Devices

The following were explored in earlier direction documents but are **not part of the delivered package** and are not currently authorized for use:

- **Facet Seal** (mark enclosed in a circular border for physical/embossed contexts) — not delivered, not approved for use.
- **Gold-fill logo variant** — not delivered as a file; gold is approved only as a restricted, separate accent per `LOGO_USAGE.md` §3, never as the logo's own fill.
- **Vertical / stacked lockup** — not delivered. If a square or portrait placement is needed, use the icon-only mark (`logo-icon.svg`) rather than fabricating a stacked composition.

---

## 6. Color Usage

The logo's approved colors are fixed to the values in the delivered files, not to the UI design-token scale:

| Context | Value | Source |
|---|---|---|
| Primary mark (light backgrounds) | `#1D1D1B` (near black) | `logo-primary.svg`, `logo-light.svg`, `logo-icon.svg` |
| Reversed mark (dark backgrounds) | `#FFFFFF` (white) | `logo-dark.svg` (which also carries its own `#1D1D1B` background fill) |
| Interface background behind the logo | `#F8F7F3` (warm white) | `site.webmanifest` `background_color` |
| Accent only, never the logo fill | `#C8A55A` (champagne gold) | `LOGO_USAGE.md` §3 |

The logo, in every variant, renders in a single flat color — never two colors in the same lockup, never a gradient. Full usage rules are in `LOGO_USAGE.md`.

---

## 7. Responsive Versions — What Actually Exists

| Context | Asset | Status |
|---|---|---|
| Wide header, light background | `logo-primary.svg` | Delivered |
| Dark navigation/footer | `logo-dark.svg` (self-contained dark tile) | Delivered |
| Light background, explicit full lockup | `logo-light.svg` | Delivered |
| Compact/square UI, mobile nav | `logo-icon.svg` | Delivered |
| Browser tab / OS / PWA icons | Favicon + manifest set | Delivered |
| Square/portrait stacked lockup | — | **Not delivered — do not fabricate** |
| Physical/embossed seal variant | — | **Not delivered — do not fabricate** |

---

## 8. Summary

The KENZ mark, as approved and delivered, is a solid geometric K monogram — no facets, no open hairline construction, no enclosing seal — paired with a serif "KENZ" wordmark. It carries the brand's precision-and-restraint positioning through construction alone: straight lines, hard angles, one fill color, no ornament. This document, along with `LOGO_SPEC.md` and `LOGO_USAGE.md`, now describes only what was actually produced and approved.

---

*End of LOGO_CONCEPT.md*