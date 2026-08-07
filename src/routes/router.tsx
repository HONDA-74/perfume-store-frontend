import { createBrowserRouter } from 'react-router';
import { routeConfig } from './routes.config';

/**
 * The single `createBrowserRouter` instance for the app, consumed by
 * `<RouterProvider>` in `src/main.tsx`. Kept separate from `routes.config.tsx`
 * so the route *data* (paths/elements/error boundaries) and the router
 * *instantiation* are independently testable/replaceable.
 */
export const router = createBrowserRouter(routeConfig);
