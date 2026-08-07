/**
 * Temporary inline placeholder for routes whose real page component
 * doesn't exist yet. Kept in its own file (rather than inline in
 * `routes.config.tsx`) purely so that file exports route data only —
 * satisfies the react-refresh/only-export-components rule and keeps the
 * "component vs. config" boundary clean.
 *
 * Delete this file once every route in `routes.config.tsx` has a real
 * page element.
 */
export function RoutePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8 text-center">
      <p className="text-body-sm tracking-wide text-neutral-400 uppercase">
        {label} — not yet implemented
      </p>
    </div>
  );
}
