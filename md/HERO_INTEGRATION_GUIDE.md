# Hero Section Integration Guide

## Overview

The Hero section has been implemented with placeholder sections for React Bits animated components. This document explains where and how to integrate the provided React Bits components.

---

## File Structure

```
src/
├── components/
│   └── hero/
│       ├── hero-section.tsx    # Main Hero component
│       └── index.ts             # Barrel export
├── routes/
│   └── home.tsx                 # Home page using Hero
```

---

## Integration Points

### 1. DepthText Component (Main Headline)

**Location:** `src/components/hero/hero-section.tsx` (Line ~39-50)

**Text to animate:**
```
Your Signature.
Reimagined.
```

**Current placeholder code:**
```tsx
<h1 className="font-serif text-[2.5rem] leading-[1.1] md:text-[4rem] lg:text-[5rem] tracking-tight text-neutral-0">
  Your Signature.
  <br />
  <span className="text-primary-400">Reimagined.</span>
</h1>
```

**Integration instructions:**
1. Import the DepthText component at the top of the file
2. Replace the `<h1>` placeholder with the DepthText component
3. Pass the text as children or via props (depending on React Bits API)
4. Preserve the existing className styles or adapt them to the component's API
5. Ensure the "Reimagined" portion uses `text-primary-400` (Champagne Gold accent)

**Example integration structure:**
```tsx
<DepthText 
  className="font-serif text-[2.5rem] leading-[1.1] md:text-[4rem] lg:text-[5rem] tracking-tight text-neutral-0"
  as="h1"
>
  Your Signature.{'\n'}
  <span className="text-primary-400">Reimagined.</span>
</DepthText>
```

---

### 2. BlurText Component (Supporting Text)

**Location:** `src/components/hero/hero-section.tsx` (Line ~53-64)

**Text to animate:**
```
Discover fragrances curated around your taste, your mood, and the moments that define you.
```

**Current placeholder code:**
```tsx
<p className="font-sans text-body-lg md:text-h4 leading-relaxed text-neutral-100/90">
  Discover fragrances curated around your taste, your mood, and the moments
  that define you.
</p>
```

**Integration instructions:**
1. Import the BlurText component
2. Replace the `<p>` placeholder with the BlurText component
3. Configure animation to enter after the DepthText headline completes
4. Preserve the existing className styles

**Example integration structure:**
```tsx
<BlurText 
  className="font-sans text-body-lg md:text-h4 leading-relaxed text-neutral-100/90"
  delay={0.5} // Start after headline
>
  Discover fragrances curated around your taste, your mood, and the moments
  that define you.
</BlurText>
```

---

### 3. TextType Component (Eyebrow - Optional)

**Location:** `src/components/hero/hero-section.tsx` (Line ~27-35)

**Text to animate:**
```
THE ART OF PERFUMERY
```

**Current placeholder code:**
```tsx
<p className="font-sans text-caption md:text-body-sm uppercase tracking-[0.2em] text-primary-400/90">
  The Art of Perfumery
</p>
```

**Integration instructions:**
1. **ONLY use TextType if it enhances the luxury feel** - this is optional
2. Test both animated and static versions
3. If TextType feels too "tech demo" or distracts from the headline, keep it static
4. The eyebrow should be subtle and refined, not the star of the show

**If using TextType:**
```tsx
<TextType 
  className="font-sans text-caption md:text-body-sm uppercase tracking-[0.2em] text-primary-400/90"
  speed={80} // Slow, elegant typing
>
  THE ART OF PERFUMERY
</TextType>
```

**If keeping it static:**
Keep the current `<p>` tag as-is.

---

## Animation Timing & Sequence

Recommended animation sequence:

1. **Eyebrow** (optional TextType): Start immediately on mount, subtle
2. **Headline** (DepthText): Start after eyebrow completes or immediately
3. **Supporting Text** (BlurText): Start after headline is visible (~0.5-0.8s delay)
4. **CTAs**: Fade in after supporting text (~0.3s delay)

**Total sequence should complete in ~2-3 seconds max** - keep it elegant and unhurried.

---

## Animation Configuration

### Speed/Duration Guidelines

- **Slow**: Luxury, considered, premium
- **Medium**: Avoid - feels generic/SaaS-y
- **Fast**: Avoid - feels rushed/cheap

### Easing

Use the design system's motion tokens:
- `ease-standard`: `cubic-bezier(0.2, 0.0, 0.0, 1.0)`
- `ease-enter`: `cubic-bezier(0.0, 0.0, 0.2, 1.0)`

### Reduced Motion

**CRITICAL:** All animations MUST respect `prefers-reduced-motion`:

```tsx
import { useReducedMotion } from 'framer-motion'; // or equivalent

const shouldReduceMotion = useReducedMotion();

// If reduced motion is preferred, disable or simplify animations
```

---

## Color Usage

### Existing Design System Colors

The Hero uses these exact colors from the design system:

| Element | Token | Hex Equivalent | Usage |
|---------|-------|----------------|-------|
| Background base | `neutral-900` | `#0A0A0A` | Base dark layer |
| Background overlay | `neutral-900/60` | `rgba(10,10,10,0.6)` | Readability scrim |
| Headline | `neutral-0` | `#FFFFFF` | Main text |
| "Reimagined" accent | `primary-400` | `hsl(43 82% 52%)` | Champagne gold |
| Eyebrow | `primary-400/90` | Translucent gold | Editorial refinement |
| Supporting text | `neutral-100/90` | `rgba(247,247,247,0.9)` | Soft white |
| Primary CTA bg | `primary-500` | `hsl(43 78% 44%)` | Metallic gold |
| Primary CTA text | `neutral-900` | `#0A0A0A` | High contrast |
| Secondary CTA border | `primary-500/50` | Translucent gold | Elegant outline |
| Secondary CTA text | `primary-400` | Champagne gold | Match eyebrow |

**DO NOT:**
- Use arbitrary hex colors
- Introduce new colors not in the design system
- Use bright/saturated colors
- Increase gold usage beyond the specified accents

---

## Liquid Ether Background

The background is implemented as a pure CSS gradient composition with:

1. **Base gradient**: Dark neutral tones (900 → 800 → 900)
2. **Three radial overlays**: Subtle gold accents at 15%, 10%, and 8% opacity
3. **Noise texture**: SVG-based noise at 1.5% opacity for depth

**Characteristics:**
- Atmospheric and subtle
- Never overpowers text
- Provides depth without distraction
- Dark sophistication

**DO NOT:**
- Add animated particles (too busy)
- Use bright gradients
- Add JavaScript-based effects
- Compromise text readability

---

## Responsive Behavior

### Desktop (lg+)
- Headline: 5rem (80px)
- Full-height hero
- Centered content
- Generous spacing

### Tablet (md)
- Headline: 4rem (64px)
- Maintained proportions
- Slightly reduced spacing

### Mobile (sm and below)
- Headline: 2.5rem (40px)
- Stacked CTAs (full width → auto width transition)
- Preserved hierarchy
- Maintained readability

**Test on all breakpoints before finalizing.**

---

## CTA Behavior

### Primary CTA: "Explore the Collection"
- **Route:** `/shop` (ROUTES.shop)
- **Style:** Solid gold background
- **Hover:** Lighter gold + shadow-gold
- **Active:** Scale down to 0.98

### Secondary CTA: "Find Your Signature →"
- **Route:** `/scent-matchmaker` (ROUTES.scentMatchmaker)
- **Style:** Gold border, transparent background
- **Hover:** Border brightens, subtle gold background
- **Active:** Scale down to 0.98
- **Arrow:** Translates right on hover

**Both CTAs:**
- Focus ring: 2px primary-500 with offset
- Keyboard accessible
- Touch-friendly sizing (48px min height)

---

## Accessibility Checklist

- [ ] All text meets WCAG AA contrast ratios
- [ ] Animations respect `prefers-reduced-motion`
- [ ] CTAs are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Semantic HTML structure (section, h1, p)
- [ ] Alternative text for visual content (if images added)
- [ ] Sufficient touch targets (44x44px minimum)

---

## Testing Checklist

- [ ] Hero renders on homepage
- [ ] All animations trigger on mount
- [ ] Animations complete in 2-3 seconds
- [ ] Reduced motion disables/simplifies animations
- [ ] Text remains readable during animation
- [ ] CTAs are clickable and route correctly
- [ ] Responsive on mobile (320px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] No performance issues (60fps)
- [ ] No layout shift during animation
- [ ] Background doesn't overpower text
- [ ] Gold accent is subtle and intentional
- [ ] Typography hierarchy is clear
- [ ] Focus states work correctly

---

## Performance Considerations

- **Keep animations performant:**
  - Use `transform` and `opacity` only (GPU accelerated)
  - Avoid `width`, `height`, `top`, `left` animations
  - Use `will-change` sparingly and only during animation

- **Background optimizations:**
  - Background is pure CSS (no heavy images)
  - Noise texture is inline SVG (no additional request)
  - Gradients are hardware accelerated

---

## Visual Direction Notes

**The Hero should feel:**
- ✅ Slow and elegant
- ✅ Cinematic and editorial
- ✅ Premium and intentional
- ✅ Dark and sophisticated
- ✅ Minimal yet luxurious

**The Hero should NOT feel:**
- ❌ Fast or bouncy
- ❌ Tech demo-y
- ❌ Generic SaaS
- ❌ Flashy or over-animated
- ❌ Bright or saturated
- ❌ Busy or cluttered

**Remember:** The headline is the dominant visual element. Animations should enhance it, not compete with it.

---

## Next Steps

1. **Integrate React Bits components** at the marked TODO locations
2. **Test animation timing** - adjust delays for smooth sequence
3. **Verify reduced motion** - ensure graceful fallback
4. **Test responsive behavior** - all breakpoints
5. **Review with brand guidelines** - does it feel luxury?
6. **Get approval** before building additional landing sections

---

## Questions?

If the React Bits component APIs don't match the integration examples above:
1. Adapt the integration to match their actual API
2. Preserve the className styles
3. Maintain the animation sequence and timing
4. Keep the visual hierarchy intact

The goal is **premium, cinematic luxury** - not technical showmanship.
