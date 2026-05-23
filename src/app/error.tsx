"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020817] px-4 text-center text-white">
      <h1 className="text-5xl font-black">
        Something Went Wrong
      </h1>

      <p className="mt-4 text-gray-400">
        An unexpected error occurred.
      </p>

      <Button
        onClick={reset}
        className="mt-6"
      >
        Try Again
      </Button>
    </div>
  );
}