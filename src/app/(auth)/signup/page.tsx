import Link from "next/link";

import { Plane } from "lucide-react";

import { AuthForm } from "@/components/shared/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] px-4">
      <div className="absolute inset-0 bg-linear-to-b from-cyan-500/10 via-transparent to-transparent" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex items-center gap-2">
          <Plane className="h-8 w-8 text-cyan-500" />

          <h1 className="text-3xl font-black text-white">
            SkyLine
          </h1>
        </div>

        <AuthForm type="signup" />

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}