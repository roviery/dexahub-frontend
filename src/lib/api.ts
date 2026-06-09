import type {
  AttendanceRecord,
  LoginResponse,
  RefreshResponse,
} from "@/types/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Pull a human-readable message out of a Nest exception body. */
async function extractError(res: Response): Promise<ApiError> {
  let message = res.statusText || "Request failed";
  try {
    const body = await res.json();
    if (typeof body?.message === "string") message = body.message;
    else if (Array.isArray(body?.message)) message = body.message.join(", ");
  } catch {
    // non-JSON body — keep the status text
  }
  return new ApiError(res.status, message);
}

// Single-flight refresh: concurrent 401s share one /auth/refresh call.
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError(401, "No refresh token");

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw await extractError(res);

  const data = (await res.json()) as RefreshResponse;
  setTokens(data.accessToken); // refresh token is unchanged by the backend
  return data.accessToken;
}

function onSessionExpired(): void {
  clearTokens();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | null;
  /** Skip the Authorization header (used by login/refresh). */
  auth?: boolean;
}

/**
 * fetch wrapper that attaches the Bearer token and transparently refreshes it
 * once on a 401 before retrying the original request.
 */
async function apiFetch<T>(
  path: string,
  { auth = true, headers, ...init }: ApiFetchOptions = {},
): Promise<T> {
  const buildHeaders = (token: string | null): HeadersInit => {
    const h = new Headers(headers);
    if (auth && token) h.set("Authorization", `Bearer ${token}`);
    return h;
  };

  const send = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, { ...init, headers: buildHeaders(token) });

  let res = await send(getAccessToken());

  if (res.status === 401 && auth) {
    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      res = await send(newToken);
    } catch {
      onSessionExpired();
      throw new ApiError(401, "Session expired");
    }
  }

  if (!res.ok) throw await extractError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---- Endpoint helpers -------------------------------------------------------

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiFetch<{ success: boolean }>("/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearTokens();
  }
}

export function getMyAttendance(): Promise<AttendanceRecord[]> {
  return apiFetch<AttendanceRecord[]>("/attendance/me");
}

export function checkIn(photo: File): Promise<AttendanceRecord> {
  const form = new FormData();
  form.append("photo", photo);
  // No Content-Type header: the browser sets the multipart boundary itself.
  return apiFetch<AttendanceRecord>("/attendance/check-in", {
    method: "POST",
    body: form,
  });
}
