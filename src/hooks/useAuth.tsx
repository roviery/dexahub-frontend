"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { login as apiLogin, logout as apiLogout } from "@/lib/api";
import { getAccessToken, subscribeTokens } from "@/lib/auth-storage";
import { decodeJwt } from "@/lib/jwt";
import { UserRole } from "@/types/api";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

// Stable references for useSyncExternalStore.
const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Read the token straight from the storage "external store" so login/logout
  // (which notify on write) re-render consumers without effects.
  const token = useSyncExternalStore(
    subscribeTokens,
    getAccessToken,
    () => null, // server snapshot
  );

  // SSR-safe "are we on the client yet?" flag — false during hydration,
  // true afterwards, with no setState-in-effect.
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const login = useCallback(async (email: string, password: string) => {
    await apiLogin(email, password); // setTokens() notifies the store
  }, []);

  const logout = useCallback(async () => {
    await apiLogout(); // clearTokens() notifies the store
  }, []);

  const value = useMemo<AuthState>(() => {
    const payload = decodeJwt(token);
    return {
      isAuthenticated: payload !== null,
      isLoading: !isHydrated,
      userId: payload?.sub ?? null,
      role: payload?.role ?? null,
      login,
      logout,
    };
  }, [token, isHydrated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { UserRole };
