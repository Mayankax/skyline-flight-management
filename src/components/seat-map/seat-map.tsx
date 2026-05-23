"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";

import { useFlightStore } from "@/stores/flight-store";

import type { Seat } from "@/types/seat";

import { SeatItem } from "./seat-item";

interface Props {
  initialSeats: Seat[];

  flightId: string;
}

export function SeatMap({
  initialSeats,
  flightId,
}: Props) {
  const [seats, setSeats] =
    useState(initialSeats);

  const {
    selectedSeatId,
    setSelectedSeatId,
    setSelectedSeatData,
  } = useFlightStore();

  useEffect(() => {
    const channel =
      supabase.channel(
        `seats-${flightId}`
      );

    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",

        schema: "public",

        table: "seats",

        filter: `flight_id=eq.${flightId}`,
      },
      (payload) => {
        setSeats((prev) =>
          prev.map((seat) =>
            seat.id ===
            payload.new.id
              ? {
                  ...seat,
                  is_available:
                    payload.new
                      .is_available,
                }
              : seat
          )
        );

        toast.info(
          "Seat availability updated"
        );
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [flightId]);

  function handleSeatSelect(
    seat: Seat
  ) {
    if (!seat.is_available) {
      return;
    }

    setSelectedSeatId(seat.id);

    setSelectedSeatData({
      seatNumber:
        seat.seat_number,

      class: seat.class,

      extraFee: seat.extra_fee,
    });

    toast.success(
      `Seat ${seat.seat_number} selected`
    );
  }

  const groupedSeats = {
    first: seats.filter(
      (seat) =>
        seat.class === "first"
    ),

    business: seats.filter(
      (seat) =>
        seat.class ===
        "business"
    ),

    economy: seats.filter(
      (seat) =>
        seat.class ===
        "economy"
    ),
  };

  return (
    <div className="space-y-10">
      <SeatLegend />

      {Object.entries(
        groupedSeats
      ).map(([key, seats]) => (
        <div key={key}>
          <h2 className="mb-4 text-2xl font-bold capitalize">
            {key} Class
          </h2>

          <div className="grid grid-cols-6 gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {seats.map((seat) => (
              <SeatItem
                key={seat.id}
                seat={seat}
                selected={
                  selectedSeatId ===
                  seat.id
                }
                onClick={() =>
                  handleSeatSelect(
                    seat
                  )
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SeatLegend() {
  return (
    <div className="flex flex-wrap gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-white/10" />

        Available
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-blue-500" />

        Selected
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-red-500/40" />

        Occupied
      </div>
    </div>
  );
}