"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";
import { CameraCapture } from "@/components/attendance/CameraCapture";
import { CheckInCard } from "@/components/attendance/CheckInCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, checkIn, getMyAttendance } from "@/lib/api";
import { isToday } from "@/lib/attendance";
import type { AttendanceRecord } from "@/types/api";

function CheckInContent() {
  const { logout } = useAuth();
  const router = useRouter();

  const [records, setRecords] = useState<AttendanceRecord[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setRecords(await getMyAttendance());
    } catch {
      toast.error("Could not load your attendance.");
      setRecords([]);
    }
  }, []);

  // Initial load. setState runs inside the promise callbacks (after the await),
  // never synchronously in the effect body.
  useEffect(() => {
    let cancelled = false;
    getMyAttendance()
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Could not load your attendance.");
          setRecords([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const todayRecord = records?.find((r) => isToday(r.date)) ?? null;

  async function handleConfirm(photo: File) {
    setIsSubmitting(true);
    try {
      await checkIn(photo);
      toast.success("You're checked in. Have a great day!");
      await loadRecords();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.info("You've already checked in today.");
        await loadRecords();
      } else {
        toast.error("Check-in failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Daily check-in</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOutIcon />
          Log out
        </Button>
      </header>

      {records === null ? (
        <Skeleton className="aspect-4/3 w-full rounded-xl" />
      ) : todayRecord ? (
        <CheckInCard record={todayRecord} />
      ) : (
        <CameraCapture onConfirm={handleConfirm} isSubmitting={isSubmitting} />
      )}

      {records !== null && <AttendanceHistory records={records} />}
    </div>
  );
}

export default function CheckInPage() {
  return (
    <ProtectedRoute>
      <CheckInContent />
    </ProtectedRoute>
  );
}
