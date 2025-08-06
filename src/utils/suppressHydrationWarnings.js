// Suppress hydration warnings in development
export const suppressHydrationWarnings = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args[0];

      // Suppress specific hydration warnings
      if (
        typeof message === 'string' && (
          message.includes('Warning: Expected server HTML') ||
          message.includes('Warning: Text content did not match') ||
          message.includes('Warning: Prop') ||
          message.includes('hydration') ||
          message.includes('Hydration') ||
          message.includes('did not match')
        )
      ) {
        return;
      }

      originalError(...args);
    };

    console.warn = (...args) => {
      const message = args[0];

      // Suppress hydration-related warnings
      if (
        typeof message === 'string' && (
          message.includes('hydration') ||
          message.includes('Hydration') ||
          message.includes('did not match')
        )
      ) {
        return;
      }

      originalWarn(...args);
    };
  }
};