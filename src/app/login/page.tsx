import { ClipboardCheckIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

const FEATURES = [
  { icon: ClipboardCheckIcon, label: "Photo-verified check-ins" },
  { icon: UsersIcon, label: "Employee management portal" },
  { icon: ShieldCheckIcon, label: "Secure role-based access" },
] as const;

export default function LoginPage() {
  return (
    <main className="flex min-h-svh">
      {/* -- Left: brand panel (desktop only) ------------------------------- */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-red-700 p-12 text-white select-none">
        {/* Decorative circles */}
        <div className="absolute -top-28 -right-28 size-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-36 size-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-red-900/50" />
        <div className="absolute bottom-36 right-16 size-36 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <ClipboardCheckIcon className="size-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight">DexaHub</span>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Your workforce,
              <br />
              perfectly tracked.
            </h1>
            <p className="max-w-xs text-lg leading-relaxed text-red-200">
              Real-time attendance, employee management, and HR insights — all
              in one place.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-red-100">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-sm text-red-300">
          © {new Date().getFullYear()} DexaHub. All rights reserved.
        </p>
      </div>

      {/* -- Right: form panel ---------------------------------------------- */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-xl bg-red-600">
            <ClipboardCheckIcon className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold">DexaHub</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your employee account to continue.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Having trouble?{" "}
            <span className="font-medium text-red-600">
              Contact your HR administrator.
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
