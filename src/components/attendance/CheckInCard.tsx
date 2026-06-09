"use client";

import Image from "next/image";
import { CheckCircle2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AttendanceRecord } from "@/types/api";
import { formatTime, photoUrl } from "@/lib/attendance";

/** Success state shown once the employee has checked in for the day. */
export function CheckInCard({ record }: { record: AttendanceRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-500">
          <CheckCircle2Icon className="size-5" />
          Checked in for today
        </CardTitle>
        <CardDescription>
          Recorded at {formatTime(record.checkInAt)}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={photoUrl(record.photoPath)}
            alt="Your check-in photo"
            fill
            sizes="(max-width: 640px) 100vw, 384px"
            className="object-cover"
            unoptimized
          />
        </div>
      </CardContent>
    </Card>
  );
}
