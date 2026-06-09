"use client";

import Image from "next/image";
import { ClockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTime, photoUrl } from "@/lib/attendance";
import type { AttendanceRecord, Employee } from "@/types/api";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  employees: Employee[];
  isLoading: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AttendanceTable({
  records,
  employees,
  isLoading,
}: AttendanceTableProps) {
  function findEmployee(employeeId: string) {
    return employees.find((e) => e.id === employeeId);
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-36 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16 pl-5">Photo</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="pr-5">Check-in Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-14 text-center text-sm text-muted-foreground"
              >
                No attendance records found for the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => {
              const emp = findEmployee(record.employeeId);
              return (
                <TableRow key={record.id}>
                  {/* Photo thumbnail */}
                  <TableCell className="pl-5">
                    <a
                      href={photoUrl(record.photoPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                      aria-label="View check-in photo"
                    >
                      <div className="relative size-10 overflow-hidden rounded-lg bg-muted ring-1 ring-black/5 transition-opacity hover:opacity-80">
                        <Image
                          src={photoUrl(record.photoPath)}
                          alt="Check-in photo"
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </a>
                  </TableCell>

                  {/* Employee name + avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-700">
                        {emp ? getInitials(emp.fullName) : "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {emp?.fullName ?? record.employeeId}
                        </p>
                        {emp?.position && (
                          <p className="truncate text-xs text-muted-foreground">
                            {emp.position}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {emp?.department ?? "—"}
                  </TableCell>

                  <TableCell className="text-sm">
                    {formatDate(record.date)}
                  </TableCell>

                  {/* Time chip */}
                  <TableCell className="pr-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20">
                      <ClockIcon className="size-3" />
                      {formatTime(record.checkInAt)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
