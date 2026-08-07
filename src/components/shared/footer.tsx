import * as React from 'react';
import { cn } from '@/lib';
import { Logo } from './logo';
import { NavigationLink } from './navigation-link';
import { Separator } from '@/components/ui/separator';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  sections?: FooterSection[];
  copyrightText?: string;
  socialLinks?: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

/**
 * Footer — global site footer with multi-column link sections,
 * brand message, and copyright information.
 * Per Design_System.md §3.18 and BRAND_GUIDELINES.md.
 */
const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      sections = [],
      copyrightText = `© ${new Date().getFullYear()} KENZ. All rights reserved.`,
      socialLinks = [],
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <footer
        ref={ref}
        className={cn('border-t border-neutral-200 bg-neutral-900', className)}
        {...props}
      >
        <div className="container mx-auto px-4 py-12 lg:px-6 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Logo variant="light" size="md" showTagline />
              <p className="mt-4 text-body-sm text-neutral-400">
                A curated collection of the world&rsquo;s most respected
                fragrance houses, gathered in one place.
              </p>
            </div>

            {/* Link Sections */}
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 font-serif text-h4 font-semibold text-neutral-0">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <NavigationLink
                        href={link.href}
                        variant="footer"
                      >
                        {link.label}
                      </NavigationLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-neutral-800" />

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-body-sm text-neutral-500">{copyrightText}</p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    aria-label={social.label}
                    className="text-neutral-400 transition-colors hover:text-neutral-0"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  },
);
Footer.displayName = 'Footer';

export { Footer };
