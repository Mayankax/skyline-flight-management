"use client";

import { useEffect, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";

import { toast } from "sonner";

import {
  rescheduleBooking,
} from "@/actions/booking.actions";

import type { Flight } from "@/types/flight";

import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Seat {
  id: string;
  seat_number: string;
  class: "economy" | "business" | "first";
  is_available: boolean;
  extra_fee: number;
  flight_id: string;
}

interface Props {
  bookingId: string;
  flights: Flight[];
}

export function RescheduleFlights({
  bookingId,
  flights,
}: Props) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const [selectedFlightId, setSelectedFlightId] =
    useState<string | null>(null);

  const [selectedSeatId, setSelectedSeatId] =
    useState<string | null>(null);

  const [seats, setSeats] =
    useState<Seat[]>([]);

  const [loadingSeats, setLoadingSeats] =
    useState(false);

  /*
   * Load seats whenever the user selects
   * a different flight.
   */
  async function handleSelectFlight(
    flightId: string
  ) {
    setSelectedFlightId(flightId);

    // Clear previously selected seat
    setSelectedSeatId(null);

    // Clear old seats while loading
    setSeats([]);

    setLoadingSeats(true);

    const {
      data,
      error,
    } = await supabase
      .from("seats")
      .select("*")
      .eq("flight_id", flightId)
      .order("seat_number");

    setLoadingSeats(false);

    if (error) {
      toast.error(
        "Failed to load seats"
      );

      return;
    }

    setSeats(
      (data ?? []) as Seat[]
    );
  }

  /*
   * Select an available seat.
   */
  function handleSelectSeat(
    seat: Seat
  ) {
    if (!seat.is_available) {
      return;
    }

    setSelectedSeatId(seat.id);
  }

  /*
   * Confirm the reschedule.
   */
  function handleConfirmReschedule() {
    if (!selectedFlightId) {
      toast.error(
        "Please select a flight"
      );

      return;
    }

    if (!selectedSeatId) {
      toast.error(
        "Please select a seat"
      );

      return;
    }

    startTransition(async () => {
      const result =
        await rescheduleBooking(
          bookingId,
          selectedFlightId,
          selectedSeatId
        );

      if (result?.error) {
        toast.error(
          result.error
        );

        return;
      }

      toast.success(
        "Flight rescheduled successfully"
      );

      router.push(
        "/my-bookings"
      );

      router.refresh();
    });
  }

  /*
   * Realtime seat availability.
   *
   * If another user books a seat on the
   * selected flight, this UI updates automatically.
   */
  useEffect(() => {
    if (!selectedFlightId) {
      return;
    }

    const channel =
      supabase
        .channel(
          `reschedule-seats-${selectedFlightId}`
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "seats",
            filter: `flight_id=eq.${selectedFlightId}`,
          },
          (payload) => {
            const updatedSeat =
              payload.new as Seat;

            setSeats(
              (currentSeats) =>
                currentSeats.map(
                  (seat) =>
                    seat.id ===
                    updatedSeat.id
                      ? {
                          ...seat,
                          is_available:
                            updatedSeat.is_available,
                        }
                      : seat
                )
            );

            /*
             * If the seat that the user had
             * selected becomes unavailable,
             * automatically remove selection.
             */
            if (
              !updatedSeat.is_available
            ) {
              setSelectedSeatId(
                (current) =>
                  current ===
                  updatedSeat.id
                    ? null
                    : current
              );
            }
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [selectedFlightId]);

  /*
   * Group seats by class.
   */
  const firstClassSeats =
    seats.filter(
      (seat) =>
        seat.class === "first"
    );

  const businessClassSeats =
    seats.filter(
      (seat) =>
        seat.class === "business"
    );

  const economyClassSeats =
    seats.filter(
      (seat) =>
        seat.class === "economy"
    );

  /*
   * Render a seat section.
   */
  function renderSeatSection(
    title: string,
    sectionSeats: Seat[]
  ) {
    if (sectionSeats.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {title}
          </h3>

          {sectionSeats[0]?.extra_fee >
            0 && (
            <span className="text-sm text-gray-400">
              +₹
              {sectionSeats[0].extra_fee.toLocaleString(
                "en-IN"
              )}
            </span>
          )}
        </div>

        <div className="grid grid-cols-6 gap-3">
          {sectionSeats.map(
            (seat) => {
              const isSelected =
                selectedSeatId ===
                seat.id;

              return (
                <button
                  key={seat.id}
                  type="button"
                  disabled={
                    !seat.is_available ||
                    pending
                  }
                  onClick={() =>
                    handleSelectSeat(
                      seat
                    )
                  }
                  className={`
                    relative
                    rounded-lg
                    border
                    px-3
                    py-3
                    text-sm
                    font-semibold
                    transition
                    ${
                      !seat.is_available
                        ? "cursor-not-allowed border-red-500/30 bg-red-500/10 text-red-400 opacity-50"
                        : isSelected
                          ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "border-white/10 bg-white/5 text-white hover:border-blue-400 hover:bg-blue-500/10"
                    }
                  `}
                >
                  {seat.seat_number}
                </button>
              );
            }
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------ */}
      {/* PAGE HEADER */}
      {/* ------------------------------------------------ */}

      <div>
        <h1 className="text-5xl font-black">
          Reschedule Flight
        </h1>

        <p className="mt-2 text-gray-400">
          Choose an alternative flight
          and select your new seat.
        </p>
      </div>

      {/* ------------------------------------------------ */}
      {/* ALTERNATIVE FLIGHTS */}
      {/* ------------------------------------------------ */}

      <div className="space-y-5">
        {flights.length === 0 ? (
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">
                No alternative flights
                are available.
              </p>
            </CardContent>
          </Card>
        ) : (
          flights.map((flight) => {
            const isSelected =
              selectedFlightId ===
              flight.id;

            return (
              <Card
                key={flight.id}
                className={`
                  border
                  bg-white/5
                  backdrop-blur-xl
                  transition
                  ${
                    isSelected
                      ? "border-blue-500/70 bg-blue-500/5"
                      : "border-white/10"
                  }
                `}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* -------------------------------- */}
                    {/* ROUTE / FLIGHT INFO */}
                    {/* -------------------------------- */}

                    <div>
                      <h2 className="text-2xl font-bold">
                        {flight.origin}{" "}
                        →{" "}
                        {
                          flight.destination
                        }
                      </h2>

                      <p className="mt-1 text-gray-400">
                        {
                          flight.flight_no
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          flight.aircraft_type
                        }
                      </p>
                    </div>

                    {/* -------------------------------- */}
                    {/* DATE / TIME */}
                    {/* -------------------------------- */}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          Departure
                        </p>

                        <p className="mt-1 font-semibold">
                          {format(
                            new Date(
                              flight.departs_at
                            ),
                            "PPP"
                          )}
                        </p>

                        <p className="text-sm text-gray-400">
                          {format(
                            new Date(
                              flight.departs_at
                            ),
                            "p"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Arrival
                        </p>

                        <p className="mt-1 font-semibold">
                          {format(
                            new Date(
                              flight.arrives_at
                            ),
                            "PPP"
                          )}
                        </p>

                        <p className="text-sm text-gray-400">
                          {format(
                            new Date(
                              flight.arrives_at
                            ),
                            "p"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* -------------------------------- */}
                    {/* PRICE + BUTTON */}
                    {/* -------------------------------- */}

                    <div className="flex items-center justify-between gap-6 lg:min-w-[220px]">
                      <div>
                        <p className="text-sm text-gray-500">
                          Base Fare
                        </p>

                        <p className="text-xl font-bold">
                          ₹
                          {flight.base_price.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <Button
                        type="button"
                        disabled={
                          pending
                        }
                        onClick={() =>
                          handleSelectFlight(
                            flight.id
                          )
                        }
                      >
                        {isSelected
                          ? "Flight Selected"
                          : "Select Flight"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* SEAT SELECTION */}
      {/* ------------------------------------------------ */}

      {selectedFlightId && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <div>
              <h2 className="text-2xl font-bold">
                Select Your Seat
              </h2>

              <p className="mt-2 text-gray-400">
                Choose an available seat
                on your new flight.
              </p>
            </div>

            {/* Loading */}
            {loadingSeats ? (
              <div className="py-12 text-center">
                <p className="text-gray-400">
                  Loading seats...
                </p>
              </div>
            ) : seats.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-400">
                  No seats found for
                  this flight.
                </p>
              </div>
            ) : (
              <>
                {/* Seat legend */}

                <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-white/20 bg-white/5" />
                    Available
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-blue-500 bg-blue-500" />
                    Selected
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded border border-red-500/30 bg-red-500/10" />
                    Occupied
                  </div>
                </div>

                {/* First Class */}

                {renderSeatSection(
                  "First Class",
                  firstClassSeats
                )}

                {/* Business Class */}

                {renderSeatSection(
                  "Business Class",
                  businessClassSeats
                )}

                {/* Economy */}

                {renderSeatSection(
                  "Economy",
                  economyClassSeats
                )}

                {/* Selected seat */}

                {selectedSeatId && (
                  <div className="mt-8 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                    <p className="text-sm text-gray-400">
                      Selected Seat
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {
                        seats.find(
                          (seat) =>
                            seat.id ===
                            selectedSeatId
                        )
                          ?.seat_number
                      }
                    </p>
                  </div>
                )}

                {/* Confirm */}

                <Button
                  type="button"
                  disabled={
                    !selectedSeatId ||
                    pending
                  }
                  onClick={
                    handleConfirmReschedule
                  }
                  className="mt-8 w-full"
                  size="lg"
                >
                  {pending
                    ? "Rescheduling..."
                    : "Confirm Reschedule"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}