import * as React from 'react';
import { Link } from 'react-router';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Logo } from '@/components/shared';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FooterSection {
  title: string;
  links: Array<{ label: string; href: string }>;
}

const footerSections: FooterSection[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Perfumes', href: '/shop' },
      { label: 'Collections', href: '/collections' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Scent Finder', href: '/scent-finder' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping & Returns', href: '/shipping' },
      { label: 'Order Tracking', href: '/track-order' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '/heritage' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Authenticity', href: '/authenticity' },
      { label: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
];

/**
 * Footer — global site footer with navigation, newsletter, and brand info.
 * 
 * Features:
 * - Multi-column link sections
 * - Newsletter subscription form
 * - Social media links
 * - Brand message and copyright
 * - Dark background with luxury aesthetic
 * - Responsive column layout
 * 
 * Per Design_System.md §3.18 and UX_FLOW.md §18
 */
export function Footer() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Connect to newsletter API
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <footer
      className="border-t border-neutral-800 bg-neutral-900 text-neutral-0"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-12 lg:px-6 lg:py-16">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-2 font-serif text-h3 font-semibold text-primary-500">
            Join The Private Registry
          </h2>
          <p className="mb-6 text-body-md text-neutral-400">
            Receive invitations to private vault drops and sample releases.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="mx-auto flex max-w-md gap-2"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-neutral-700 bg-neutral-800 text-neutral-0 placeholder:text-neutral-500"
              aria-label="Email address for newsletter"
            />
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              aria-label="Subscribe to newsletter"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          <p className="mt-2 text-caption text-neutral-500">
            We respect your privacy and never share your information.
          </p>
        </div>

        <Separator className="mb-12 bg-neutral-800" />

        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo variant="light" size="md" showTagline />
            <p className="mt-4 text-body-sm text-neutral-400">
              A curated collection of the world&rsquo;s most respected fragrance
              houses, gathered in one place.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-primary-500 focus-visible:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-primary-500 focus-visible:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-primary-500 focus-visible:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-serif text-h4 font-semibold text-primary-500">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-body-sm text-neutral-400 transition-colors hover:text-neutral-0 focus-visible:text-neutral-0 focus-visible:outline-none focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-neutral-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-body-sm text-neutral-500">
            © {new Date().getFullYear()} KENZ. All rights reserved.
          </p>
          <p className="text-caption text-neutral-600">
            Curators of Scent. Keepers of Treasure.
          </p>
        </div>
      </div>
    </footer>
  );
}
