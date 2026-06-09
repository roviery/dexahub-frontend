import type { ReactNode } from "react";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRoute>
      <div className="flex min-h-svh">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-slate-50 p-8">{children}</main>
      </div>
    </AdminRoute>
  );
}
