import { lazy, Suspense } from 'react';
import { HeroSection } from '@/components/hero';

const StorytellingSection = lazy(() => import('@/components/storytelling').then((module) => ({ default: module.StorytellingSection })));
const CollectionSection = lazy(() => import('@/components/collection/collection-section').then((module) => ({ default: module.CollectionSection })));
const HousesSection = lazy(() => import('@/components/houses/houses-section').then((module) => ({ default: module.HousesSection })));
const LandingFooter = lazy(() => import('@/components/landing').then((module) => ({ default: module.LandingFooter })));

/**
 * Home Page - Landing Page
 *
 * Sections (in order):
 *  1. HeroSection       — full-bleed Liquid Ether hero with floating navbar
 *  2. StorytellingSection — cinematic scroll-driven brand narrative
 *  3. CollectionSection   — product showcase
 *  4. HousesSection       — brands marquee
 *  5. LandingFooter       — cinematic editorial footer with KENZ signature
 */
export function HomePage() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<div className="min-h-screen bg-[#0B0A0C]" aria-label="Loading the KENZ story" />}>
        <StorytellingSection />
        <CollectionSection />
        <HousesSection />
        <LandingFooter />
      </Suspense>
    </main>
  );
}
