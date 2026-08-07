import { isRouteErrorResponse, useRouteError } from 'react-router';

/**
 * Minimal fallback rendered by React Router's `errorElement` when a route
 * (or its loader/action) throws. Deliberately unstyled beyond base
 * typography — the polished error-state visuals from `Design_System.md`
 * §15 ("Error State") are UI-feature work, out of scope for this scaffold.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong.';

  return (
    <div role="alert" className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8">
      <h1 className="text-h2 font-serif">Unable to load this page</h1>
      <p className="text-body-md text-neutral-500">{message}</p>
    </div>
  );
}
