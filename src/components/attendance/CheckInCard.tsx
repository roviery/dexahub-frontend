"use client";

import Image from "next/image";
import { CheckCircle2Icon, ClockIcon } from "lucide-react";
import type { AttendanceRecord } from "@/types/api";
import { formatTime, photoUrl } from "@/lib/attendance";

export function CheckInCard({ record }: { record: AttendanceRecord }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Success banner */}
      <div className="flex items-center gap-3 border-b border-green-100 bg-green-50 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2Icon className="size-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">
            You&apos;re checked in!
          </p>
          <p className="text-xs text-green-600">
            Attendance recorded for today.
          </p>
        </div>
      </div>

      {/* Photo */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={photoUrl(record.photoPath)}
          alt="Your check-in photo"
          fill
          sizes="(max-width: 640px) 100vw, 448px"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Time */}
      <div className="flex items-center justify-center gap-2 border-t bg-slate-50 px-4 py-3">
        <ClockIcon className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Checked in at{" "}
          <span className="font-semibold text-foreground">
            {formatTime(record.checkInAt)}
          </span>
        </span>
      </div>
    </div>
  );
}
