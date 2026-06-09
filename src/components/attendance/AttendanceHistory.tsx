"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AttendanceRecord } from "@/types/api";
import { formatDate, formatTime, photoUrl } from "@/lib/attendance";

export function AttendanceHistory({ records }: { records: AttendanceRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Check-in history</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No check-ins yet. Your records will appear here.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {records.map((record) => (
              <li key={record.id} className="flex items-center gap-3 py-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={photoUrl(record.photoPath)}
                    alt={`Check-in on ${record.date}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {formatDate(record.date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Checked in at {formatTime(record.checkInAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
