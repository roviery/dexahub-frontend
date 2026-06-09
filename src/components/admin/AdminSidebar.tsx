"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheckIcon,
  ClipboardListIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/5 bg-red-50">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-[18px]">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-600">
          <ClipboardCheckIcon className="size-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-red-600">DexaHub</p>
          <p className="text-xs text-slate-500">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
          Management
        </p>
        <div className="flex flex-col gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-red-600/15 text-red-400"
                    : "text-slate-400 hover:bg-red-50 hover:text-red-900",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/5 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-900"
        >
          <LogOutIcon className="size-4 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
