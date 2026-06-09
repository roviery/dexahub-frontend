"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";

export default function Home() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (role === UserRole.HRD_ADMIN) {
      router.replace("/admin/employees");
    } else {
      router.replace("/check-in");
    }
  }, [isAuthenticated, isLoading, role, router]);

  return (
    <div className="flex min-h-svh flex-1 items-center justify-center">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
