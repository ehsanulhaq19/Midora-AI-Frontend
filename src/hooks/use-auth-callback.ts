import { useCallback } from "react";

const CALLBACK_KEY = "midorai_auth_callback_url";

export function useAuthCallback() {
  const setCallbackUrl = useCallback((url: string) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(CALLBACK_KEY, url);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const getCallbackUrl = useCallback((): string | null => {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(CALLBACK_KEY);
    } catch (e) {
      return null;
    }
  }, []);

  const clearCallbackUrl = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CALLBACK_KEY);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return { setCallbackUrl, getCallbackUrl, clearCallbackUrl };
}

export default useAuthCallback;


