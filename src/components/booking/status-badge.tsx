import { cn } from "@/lib/utils";

interface Props {
  status: string;
}

export function StatusBadge({
  status,
}: Props) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",

        status ===
          "confirmed" &&
          "bg-green-500/20 text-green-300",

        status ===
          "rescheduled" &&
          "bg-yellow-500/20 text-yellow-300",

        status ===
          "cancelled" &&
          "bg-red-500/20 text-red-300"
      )}
    >
      {status}
    </div>
  );
}