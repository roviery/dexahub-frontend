"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheckIcon, LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";
import { CameraCapture } from "@/components/attendance/CameraCapture";
import { CheckInCard } from "@/components/attendance/CheckInCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, checkIn, getMyAttendance } from "@/lib/api";
import { isToday } from "@/lib/attendance";
import type { AttendanceRecord } from "@/types/api";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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
    <div className="min-h-dvh bg-slate-50">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-red-600">
              <ClipboardCheckIcon className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold">DexaHub</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
          >
            <LogOutIcon className="size-4" />
            Log out
          </button>
        </div>
      </header>

      {/* Page content */}
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getGreeting()}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Camera / checked-in state */}
        {records === null ? (
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
        ) : todayRecord ? (
          <CheckInCard record={todayRecord} />
        ) : (
          <CameraCapture onConfirm={handleConfirm} isSubmitting={isSubmitting} />
        )}

        {/* History */}
        {records !== null && <AttendanceHistory records={records} />}
      </div>
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
