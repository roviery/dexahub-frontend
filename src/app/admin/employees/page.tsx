"use client";

import { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { EmployeeModal } from "@/components/admin/employees/EmployeeModal";
import { EmployeesTable } from "@/components/admin/employees/EmployeesTable";
import { Button } from "@/components/ui/button";
import { ApiError, listEmployees } from "@/lib/api";
import type { Employee } from "@/types/api";

const LIMIT = 20;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const loadEmployees = useCallback(async (p: number) => {
    setIsLoading(true);
    try {
      const result = await listEmployees(p, LIMIT);
      setEmployees(result.data);
      setTotal(result.total);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Could not load employees.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees(page);
  }, [loadEmployees, page]);

  function handleAdd() {
    setSelectedEmployee(null);
    setModalOpen(true);
  }

  function handleEdit(employee: Employee) {
    setSelectedEmployee(employee);
    setModalOpen(true);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  function handleSuccess() {
    void loadEmployees(page);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee accounts and access profiles.
          </p>
        </div>
        <Button onClick={handleAdd} className="cursor-pointer">
          <PlusIcon className="size-4" />
          Add Employee
        </Button>
      </div>

      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        page={page}
        total={total}
        limit={LIMIT}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
      />

      <EmployeeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        employee={selectedEmployee}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
