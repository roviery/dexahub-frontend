"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, createEmployee, updateEmployee } from "@/lib/api";
import type { CreateEmployeeData, Employee, UpdateEmployeeData } from "@/types/api";
import { UserRole } from "@/types/api";

interface EmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSuccess: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  department: string;
  position: string;
  joinedAt: string;
  isActive: boolean;
}

const emptyForm: FormState = {
  fullName: "",
  email: "",
  password: "",
  role: UserRole.EMPLOYEE,
  phone: "",
  department: "",
  position: "",
  joinedAt: "",
  isActive: true,
};

export function EmployeeModal({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeModalProps) {
  const isEdit = employee !== null;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (employee) {
      setForm({
        fullName: employee.fullName,
        email: employee.email,
        password: "",
        role: employee.role,
        phone: employee.phone ?? "",
        department: employee.department ?? "",
        position: employee.position ?? "",
        joinedAt: employee.joinedAt ?? "",
        isActive: employee.isActive,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, employee]);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (employee) {
        const dto: UpdateEmployeeData = {
          fullName: form.fullName || undefined,
          phone: form.phone || undefined,
          department: form.department || undefined,
          position: form.position || undefined,
          joinedAt: form.joinedAt || undefined,
          isActive: form.isActive,
        };
        await updateEmployee(employee.id, dto);
        toast.success("Employee updated.");
      } else {
        const dto: CreateEmployeeData = {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone || undefined,
          department: form.department || undefined,
          position: form.position || undefined,
          joinedAt: form.joinedAt || undefined,
        };
        await createEmployee(dto);
        toast.success("Employee created.");
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("This email is already registered.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Identity */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                required
              />
            </div>

            {!isEdit && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => set("role", v as UserRole)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                      <SelectItem value={UserRole.HRD_ADMIN}>HRD Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Work details */}
          <div className="border-t pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Work Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="joinedAt">Joined Date</Label>
                <Input
                  id="joinedAt"
                  type="date"
                  value={form.joinedAt}
                  onChange={(e) => set("joinedAt", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-input accent-red-600"
              />
              <Label htmlFor="isActive" className="cursor-pointer font-normal">
                Account is active
              </Label>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting && (
                <Loader2Icon className="size-4 animate-spin" />
              )}
              {isEdit ? "Save changes" : "Create employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
