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
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.fullName}</TableCell>
                <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                <TableCell>{emp.department ?? "—"}</TableCell>
                <TableCell>{emp.position ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={emp.role === UserRole.HRD_ADMIN ? "default" : "secondary"}>
                    {emp.role === UserRole.HRD_ADMIN ? "HRD Admin" : "Employee"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={emp.isActive ? "outline" : "destructive"}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(emp)}
                    aria-label={`Edit ${emp.fullName}`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? "No results" : `${rangeStart}–${rangeEnd} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
