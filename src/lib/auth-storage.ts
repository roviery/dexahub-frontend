// Token persistence in localStorage. Every accessor is SSR-safe: it returns
// null / no-ops when `window` is unavailable so it can be imported anywhere.

const ACCESS_TOKEN_KEY = "dexahub.accessToken";
const REFRESH_TOKEN_KEY = "dexahub.refreshToken";

const isBrowser = () => typeof window !== "undefined";

// --- Reactive subscription (for useSyncExternalStore consumers) -------------
type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  listeners.forEach((l) => l());
}

/** Subscribe to access-token changes (same-tab writes and cross-tab storage). */
export function subscribeTokens(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === ACCESS_TOKEN_KEY) listener();
  };
  if (isBrowser()) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (isBrowser()) window.removeEventListener("storage", onStorage);
  };
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken !== undefined) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  notify();
}

export function clearTokens(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  notify();
}
