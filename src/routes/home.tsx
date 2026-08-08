import { HeroSection } from '@/components/hero';
import { StorytellingSection } from '@/components/storytelling';

/**
 * Home Page - Landing Page
 *
 * Sections (in order):
 *  1. HeroSection       — full-bleed Liquid Ether hero with floating navbar
 *  2. StorytellingSection — cinematic scroll-driven brand narrative
 *
 * Additional landing page sections will be added here after approval.
 */
export function HomePage() {
  return (
    <main>
      <HeroSection />
      <StorytellingSection />

      {/* Additional sections will be added here after approval */}
    </main>
  );
}
