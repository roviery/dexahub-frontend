"use client";

import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/api";
import { UserRole } from "@/types/api";

interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onEdit: (employee: Employee) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function EmployeesTable({
  employees,
  isLoading,
  page,
  total,
  limit,
  onPageChange,
  onEdit,
}: EmployeesTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-36 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="size-7 rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5">Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-14 pr-5" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-14 text-center text-sm text-muted-foreground"
              >
                No employees found. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id} className="group">
                {/* Avatar + name + email */}
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        emp.isActive
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {getInitials(emp.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{emp.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {emp.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {emp.department ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {emp.position ?? "—"}
                </TableCell>

                {/* Role badge */}
                <TableCell>
                  {emp.role === UserRole.HRD_ADMIN ? (
                    <Badge variant="default">HRD Admin</Badge>
                  ) : (
                    <Badge variant="secondary">Employee</Badge>
                  )}
                </TableCell>

                {/* Status badge */}
                <TableCell>
                  {emp.isActive ? (
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-700"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </TableCell>

                <TableCell className="pr-5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(emp)}
                    aria-label={`Edit ${emp.fullName}`}
                    className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t px-5 py-3">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? "No results" : `${rangeStart}–${rangeEnd} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="cursor-pointer"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="min-w-16 text-center text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="cursor-pointer"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
