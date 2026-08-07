import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from './logo';
import { NavigationLink } from './navigation-link';

export interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationLinks?: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
  user?: {
    name: string;
    email: string;
  };
  onSignIn?: () => void;
}

/**
 * MobileNavbar — slide-over navigation panel for mobile devices.
 * Uses Sheet component with left positioning.
 */
export function MobileNavbar({
  isOpen,
  onClose,
  navigationLinks = [],
  user,
  onSignIn,
}: MobileNavbarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <Logo variant="dark" size="sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {navigationLinks.map((link) => (
              <NavigationLink
                key={link.href}
                href={link.href}
                isActive={link.isActive}
                onClick={onClose}
                className="text-h4"
              >
                {link.label}
              </NavigationLink>
            ))}
          </nav>

          <Separator />

          {/* User Section */}
          {user ? (
            <div className="flex flex-col gap-2">
              <p className="text-body-md font-semibold text-neutral-900">
                {user.name}
              </p>
              <p className="text-body-sm text-neutral-500">{user.email}</p>
            </div>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
