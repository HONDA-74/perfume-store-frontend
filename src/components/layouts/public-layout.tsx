import { Outlet } from 'react-router';

/**
 * PublicLayout — standard layout for public-facing pages.
 * 
 * Used for: Shop, Product Details, Collections, etc.
 * Includes: Full header and footer (inherited from RootLayout)
 * 
 * This layout doesn't add any extra chrome - it simply provides
 * a semantic wrapper for public pages that might need shared
 * data context or analytics in the future.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      <Outlet />
    </div>
  );
}
