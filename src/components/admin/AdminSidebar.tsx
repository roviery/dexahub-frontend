"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardListIcon, LogOutIcon, UsersIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/employees", label: "Employees", icon: UsersIcon },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardListIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col bg-slate-900">
      <div className="p-5">
        <span className="text-sm font-semibold text-white">DexaHub Admin</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === href
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
