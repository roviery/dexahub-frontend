"use client";

import Image from "next/image";
import { ClockIcon, HistoryIcon } from "lucide-react";
import type { AttendanceRecord } from "@/types/api";
import { formatDate, formatTime, photoUrl } from "@/lib/attendance";

export function AttendanceHistory({ records }: { records: AttendanceRecord[] }) {
  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <HistoryIcon className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold">Check-in history</h2>
        {records.length > 0 && (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {records.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {records.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed bg-white p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No check-ins yet. Your records will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y overflow-hidden rounded-2xl border bg-white shadow-sm">
          {records.map((record) => (
            <div key={record.id} className="flex items-center gap-3 px-4 py-3">
              {/* Thumbnail */}
              <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={photoUrl(record.photoPath)}
                  alt={`Check-in on ${record.date}`}
                  fill
                  sizes="44px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Date + time */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {formatDate(record.date)}
                </p>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <ClockIcon className="size-3" />
                  {formatTime(record.checkInAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
