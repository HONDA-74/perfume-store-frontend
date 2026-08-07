import { Outlet } from 'react-router';

/**
 * Root layout shell — the single element every route renders inside
 * (wired up in `src/routes/router.tsx`).
 *
 * Intentionally minimal: it establishes the persistent document frame
 * (base background/typography already come from `src/styles/globals.css`)
 * without implementing the Navbar/Footer organisms specified in
 * `Design_System.md` §3.17/§3.18 — those are UI-feature work, out of
 * scope for this scaffold.
 */
export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO(feature): <Navbar /> — Design_System.md §3.17 */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* TODO(feature): <Footer /> — Design_System.md §3.18 */}
    </div>
  );
}
