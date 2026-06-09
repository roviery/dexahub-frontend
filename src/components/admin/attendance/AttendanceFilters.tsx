"use client";

import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AttendanceFiltersProps {
  date: string;
  employeeName: string;
  onDateChange: (date: string) => void;
  onEmployeeNameChange: (name: string) => void;
}

export function AttendanceFilters({
  date,
  employeeName,
  onDateChange,
  onEmployeeNameChange,
}: AttendanceFiltersProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filterDate" className="text-xs text-muted-foreground">
            Date
          </Label>
          <Input
            id="filterDate"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-9 w-44"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="filterName"
            className="text-xs text-muted-foreground"
          >
            Employee name
          </Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="filterName"
              placeholder="Search by name…"
              value={employeeName}
              onChange={(e) => onEmployeeNameChange(e.target.value)}
              className="h-9 w-56 pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
