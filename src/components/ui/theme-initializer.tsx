'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/hooks/use-theme';

export function ThemeInitializer() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return null;
}
