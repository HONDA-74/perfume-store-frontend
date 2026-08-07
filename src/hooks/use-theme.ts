import { useContext } from 'react';
import { ThemeProviderContext } from '@/providers/theme-provider';

/**
 * Custom hook to access theme context
 * @returns {object} Theme context with theme, setTheme, and actualTheme
 * @throws {Error} If used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
