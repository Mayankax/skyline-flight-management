"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  rescheduleBooking,
} from "@/actions/booking.actions";

import type { Flight } from "@/types/flight";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

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

  function handleReschedule(
    flightId: string
  ) {
    startTransition(async () => {
      const result =
        await rescheduleBooking(
          bookingId,
          flightId
        );

      if (result?.error) {
        toast.error(
          result.error
        );

        return;
      }

      toast.success(
        "Flight rescheduled"
      );

      router.push(
        "/my-bookings"
      );
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-black">
          Reschedule Flight
        </h1>

        <p className="mt-2 text-gray-400">
          Choose an alternative
          flight.
        </p>
      </div>

      {flights.map((flight) => (
        <Card
          key={flight.id}
          className="border-white/10 bg-white/5 backdrop-blur-xl"
        >
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-bold">
                {flight.origin} →{" "}
                {
                  flight.destination
                }
              </h2>

              <p className="mt-1 text-gray-400">
                {
                  flight.flight_no
                }
              </p>
            </div>

            <Button
              disabled={pending}
              onClick={() =>
                handleReschedule(
                  flight.id
                )
              }
            >
              Select Flight
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}