import {
  CheckCircle2,
} from "lucide-react";

import { notFound } from "next/navigation";

import { format } from "date-fns";

import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingConfirmationPage({
  params,
}: Props) {
  const { id } =
    await params;

  const supabase =
    await createClient();

  const { data: booking } =
    await supabase
      .from("bookings")
      .select(`
        *,
        flights (*),
        seats (*)
      `)
      .eq("id", id)
      .single();

  if (!booking) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-4 py-10">
      <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="space-y-8 p-10 text-center">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-20 w-20 text-green-400" />

            <h1 className="mt-6 text-5xl font-black">
              Booking Confirmed
            </h1>

            <p className="mt-3 text-gray-400">
              Your flight has been
              successfully booked.
            </p>
          </div>

          <div className="grid gap-5 rounded-3xl border border-white/10 bg-black/20 p-6 text-left md:grid-cols-2">
            <Info
              label="PNR"
              value={booking.pnr_code}
            />

            <Info
              label="Flight"
              value={
                booking.flights
                  .flight_no
              }
            />

            <Info
              label="Route"
              value={`${booking.flights.origin} → ${booking.flights.destination}`}
            />

            <Info
              label="Seat"
              value={
                booking.seats
                  .seat_number
              }
            />

            <Info
              label="Departure"
              value={format(
                new Date(
                  booking.flights.departs_at
                ),
                "PPP p"
              )}
            />

            <Info
              label="Total Paid"
              value={`₹${booking.total_price}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>
    </div>
  );
}