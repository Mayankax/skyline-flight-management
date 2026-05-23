import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { RescheduleFlights } from "@/components/booking/reschedule-flights";

interface Props {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function ReschedulePage({
  params,
}: Props) {
  const { bookingId } =
    await params;

  const supabase =
    await createClient();

  const { data: booking } =
    await supabase
      .from("bookings")
      .select(`
        *,
        flights (*)
      `)
      .eq("id", bookingId)
      .single();

  if (!booking) {
    notFound();
  }

  const { data: flights } =
    await supabase
      .from("flights")
      .select("*")
      .eq(
        "origin",
        booking.flights.origin
      )
      .eq(
        "destination",
        booking.flights
          .destination
      );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <RescheduleFlights
        bookingId={bookingId}
        flights={flights || []}
      />
    </div>
  );
}