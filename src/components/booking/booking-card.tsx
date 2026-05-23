"use client";

import { useTransition } from "react";

import { format } from "date-fns";

import { toast } from "sonner";

import Link from "next/link";

import {
  cancelBooking,
} from "@/actions/booking.actions";

import { StatusBadge } from "./status-badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  booking: any;
}

export function BookingCard({
  booking,
}: Props) {
  const [pending, startTransition] =
    useTransition();

  function handleCancel() {
    const confirmed =
      confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result =
        await cancelBooking(
          booking.id
        );

      if (result?.error) {
        toast.error(
          result.error
        );

        return;
      }

      toast.success(
        "Booking cancelled"
      );
    });
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black">
              {
                booking.flights
                  .origin
              }{" "}
              →{" "}
              {
                booking.flights
                  .destination
              }
            </h2>

            <StatusBadge
              status={
                booking.status
              }
            />
          </div>

          <p className="mt-2 text-gray-400">
            PNR:{" "}
            {
              booking.pnr_code
            }
          </p>

          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-gray-400">
                Flight
              </p>

              <p>
                {
                  booking.flights
                    .flight_no
                }
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Seat
              </p>

              <p>
                {
                  booking.seats
                    .seat_number
                }
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Departure
              </p>

              <p>
                {format(
                  new Date(
                    booking
                      .flights
                      .departs_at
                  ),
                  "PPP p"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/reschedule/${booking.id}`}>
            <Button variant="outline">
              Reschedule
            </Button>
          </Link>

          <Button
            variant="destructive"
            disabled={
              pending ||
              booking.status ===
                "cancelled"
            }
            onClick={
              handleCancel
            }
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}