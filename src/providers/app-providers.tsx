import type { PropsWithChildren } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { AuthBootstrap } from './auth-bootstrap';
import { Toaster } from '@/components/ui/toast';

/**
 * Single composition root for every app-wide provider. `main.tsx` wraps the
 * router in this one component instead of a deepening pyramid of
 * individually-imported providers — new global providers (e.g. a future
 * auth session provider) are added here, in one place, once they exist.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="kenz-dark-theme">
      <QueryProvider>
        <AuthBootstrap>{children}</AuthBootstrap>
        <Toaster position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  );
}
