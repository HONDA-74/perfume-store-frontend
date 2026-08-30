import { RouterProvider } from 'react-router';
import { AppProviders } from '@/providers/app-providers';
import { router } from '@/routes/router';
import { CustomCursor } from '@/components/ui/custom-cursor';

/**
 * Top-level application component. Mounted once by `src/main.tsx`.
 * Composition only — no business logic, no page content.
 */
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <CustomCursor />
    </AppProviders>
  );
}
