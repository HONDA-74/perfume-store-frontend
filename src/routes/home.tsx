import { HeroSection } from '@/components/hero';
import { StorytellingSection } from '@/components/storytelling';
import { CollectionSection } from '@/components/collection/collection-section';
import { HousesSection } from '@/components/houses/houses-section';
import { LandingFooter } from '@/components/landing';

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
      <StorytellingSection />
      <CollectionSection />
      <HousesSection />
      <LandingFooter />
    </main>
  );
}
