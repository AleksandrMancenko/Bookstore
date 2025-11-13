const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const persist = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // ignore storage errors (quota, private mode, etc.)
  }
};

export const restore = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
};
