import Link from "next/link";

import {
  Globe2,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AuthForm } from "@/components/shared/auth-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#020817]">
      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]" />

      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

      {/* LEFT SIDE */}

      <div className="relative hidden flex-1 flex-col justify-between border-r border-white/10 p-12 lg:flex">
        <div>
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <Plane className="h-6 w-6 text-blue-400" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                SkyLine
              </h1>

              <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
                Flight Platform
              </p>
            </div>
          </Link>

          <div className="mt-20 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles className="h-4 w-4" />

              Realtime Airline Experience
            </div>

            <h2 className="mt-8 text-6xl font-black leading-tight text-white">
              Welcome Back to the Future of Travel
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-gray-400">
              Manage bookings, select
              realtime seats, reschedule
              flights, and experience a
              modern airline platform built
              for premium travelers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FeatureCard
            icon={Globe2}
            label="Global Routes"
          />

          <FeatureCard
            icon={ShieldCheck}
            label="Secure Booking"
          />

          <FeatureCard
            icon={Sparkles}
            label="Realtime Updates"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <Plane className="h-7 w-7 text-blue-400" />
            </div>

            <h1 className="mt-4 text-4xl font-black text-white">
              SkyLine
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-black text-white">
              Login
            </h2>

            <p className="mt-3 text-gray-400">
              Access your account and
              continue your journey.
            </p>
          </div>

          <AuthForm type="login" />

          <p className="mt-8 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;

  label: string;
}

function FeatureCard({
  icon: Icon,
  label,
}: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>

      <p className="mt-4 font-medium text-white">
        {label}
      </p>
    </div>
  );
}