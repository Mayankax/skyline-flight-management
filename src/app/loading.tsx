import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020817]">
      <Loader2 className="h-16 w-16 animate-spin text-blue-400" />
    </div>
  );
}