"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AttendanceFilters } from "@/components/admin/attendance/AttendanceFilters";
import { AttendanceTable } from "@/components/admin/attendance/AttendanceTable";
import { ApiError, listAttendance, listEmployees } from "@/lib/api";
import type { AttendanceRecord, Employee } from "@/types/api";

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const attendanceFetchId = useRef(0);

  // Employees are stable — fetch once on mount.
  useEffect(() => {
    listEmployees(1, 1000)
      .then((result) => setEmployees(result.data))
      .catch(() => {
        // Attendance table still works; names fall back to employeeId.
      });
  }, []);

  const loadAttendance = useCallback(async (filterDate?: string) => {
    const fetchId = ++attendanceFetchId.current;
    setIsLoading(true);
    try {
      const result = await listAttendance({ limit: 50, date: filterDate || undefined });
      if (fetchId !== attendanceFetchId.current) return; // stale response — discard
      setRecords(result.data);
    } catch (err) {
      if (fetchId !== attendanceFetchId.current) return;
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not load attendance data.");
      }
    } finally {
      if (fetchId === attendanceFetchId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAttendance();
  }, [loadAttendance]);

  function handleDateChange(newDate: string) {
    setDate(newDate);
    void loadAttendance(newDate || undefined);
  }

  const filteredRecords = useMemo(() => {
    if (!employeeName.trim()) return records;
    const lower = employeeName.toLowerCase();
    return records.filter((r) => {
      const emp = employees.find((e) => e.id === r.employeeId);
      return emp?.fullName.toLowerCase().includes(lower);
    });
  }, [records, employees, employeeName]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and filter employee daily check-in records.
        </p>
      </div>

      <AttendanceFilters
        date={date}
        employeeName={employeeName}
        onDateChange={handleDateChange}
        onEmployeeNameChange={setEmployeeName}
      />

      <AttendanceTable
        records={filteredRecords}
        employees={employees}
        isLoading={isLoading}
      />
    </div>
  );
}
