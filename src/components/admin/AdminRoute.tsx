"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (role !== UserRole.HRD_ADMIN) {
      router.replace("/check-in");
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated || role !== UserRole.HRD_ADMIN) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
