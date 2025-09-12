/**
 * Theme utility functions for managing light/dark theme switching
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'midora-theme';

/**
 * Get the current theme from localStorage or default to light theme
 */
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored;
  }
  
  // Default to light theme
  return 'light';
}

/**
 * Set the theme and update the DOM
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getCurrentTheme();
  setTheme(theme);
  
  // Note: Removed system theme change listener to always default to light theme
  // Users can manually switch themes using the theme toggle
}
