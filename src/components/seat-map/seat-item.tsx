"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { Seat } from "@/types/seat";

interface Props {
  seat: Seat;

  selected: boolean;

  onClick: () => void;
}

export function SeatItem({
  seat,
  selected,
  onClick,
}: Props) {
  const unavailable =
    !seat.is_available;

  return (
    <motion.button
      whileTap={{
        scale: 0.95,
      }}
      whileHover={{
        scale: unavailable
          ? 1
          : 1.05,
      }}
      disabled={unavailable}
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold transition",

        seat.class === "first" &&
          "border border-yellow-500/20",

        seat.class ===
          "business" &&
          "border border-blue-500/20",

        seat.class ===
          "economy" &&
          "border border-white/10",

        unavailable &&
          "cursor-not-allowed bg-red-500/20 text-red-300 opacity-50",

        selected &&
          "bg-blue-500 text-white",

        !selected &&
          !unavailable &&
          "bg-white/5 hover:bg-white/10"
      )}
    >
      {seat.seat_number}
    </motion.button>
  );
}