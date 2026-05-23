"use client";

import { useRouter } from "next/navigation";

import { format } from "date-fns";

import { useFlightStore } from "@/stores/flight-store";

import type { Flight } from "@/types/flight";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  flight: Flight;
}

export function BookingSidebar({
  flight,
}: Props) {
  const router = useRouter();

  const {
    selectedSeatData,
  } = useFlightStore();

  const total =
    flight.base_price +
    (selectedSeatData?.extraFee ||
      0);

  return (
    <Card className="sticky top-24 h-fit border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-black">
            Booking Summary
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Review your flight
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Flight
            </span>

            <span>
              {
                flight.flight_no
              }
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Route
            </span>

            <span>
              {flight.origin} →{" "}
              {
                flight.destination
              }
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Departure
            </span>

            <span>
              {format(
                new Date(
                  flight.departs_at
                ),
                "PPP"
              )}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Seat
            </span>

            <span>
              {selectedSeatData
                ?.seatNumber ||
                "Not selected"}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg">
              Total
            </span>

            <span className="text-3xl font-black text-blue-400">
              ₹{total}
            </span>
          </div>
        </div>

        <Button
          disabled={
            !selectedSeatData
          }
          onClick={() =>
            router.push(
              `/booking/${flight.id}`
            )
          }
          className="h-12 w-full"
        >
          Continue Booking  
        </Button>
      </CardContent>
    </Card>
  );
}