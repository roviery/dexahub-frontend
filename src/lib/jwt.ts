import type { JwtPayload } from "@/types/api";

/**
 * Decode (NOT verify) a JWT's payload. The backend is the only party that
 * verifies signatures; the client just needs the `role`/`sub` claims to drive
 * routing and the greeting. Returns null for anything malformed.
 */
export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** True when the token is absent, malformed, or past its `exp`. */
export function isTokenExpired(token: string | null): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}
