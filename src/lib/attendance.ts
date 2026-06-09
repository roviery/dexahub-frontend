const UPLOADS_BASE_URL = process.env.NEXT_PUBLIC_UPLOADS_BASE_URL ?? "";

/** Build the absolute URL the gateway serves an attendance photo from. */
export function photoUrl(photoPath: string): string {
  return `${UPLOADS_BASE_URL}/uploads/${photoPath}`;
}

/** Local YYYY-MM-DD — must match how the backend keys a check-in by day. */
export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Format a date-only string (YYYY-MM-DD) without timezone drift. */
export function formatDate(dateOnly: string): string {
  return new Date(`${dateOnly}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** True when the record's date matches today (local). */
export function isToday(dateOnly: string): boolean {
  return dateOnly === todayIso();
}
