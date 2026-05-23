import Link from "next/link";

import {
  Plane,
  Sparkles,
} from "lucide-react";

import { signOut } from "@/actions/auth.actions";

import { getCurrentUser } from "@/lib/supabase/get-user";

import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user =
    await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* LOGO */}

        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-500/20">
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl" />

            <Plane className="relative h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h1 className="bg-linear-to-r from-white to-gray-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              SkyLine
            </h1>

            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400">
              Flight Platform
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-xl md:flex">
          <NavLink
            href="/"
            label="Home"
          />

          <NavLink
            href="/flights"
            label="Flights"
          />

          {user && (
            <NavLink
              href="/my-bookings"
              label="My Bookings"
            />
          )}
        </nav>

        {/* ACTIONS */}

        <div className="flex items-center gap-3">
          {!user && (
            <div className="hidden items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-300 lg:flex">
              <Sparkles className="h-3.5 w-3.5" />

              Realtime Booking Experience
            </div>
          )}

          {user ? (
            <form action={signOut}>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Logout
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 px-5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-500/40">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;

  label: string;
}

function NavLink({
  href,
  label,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className="rounded-full px-5 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}