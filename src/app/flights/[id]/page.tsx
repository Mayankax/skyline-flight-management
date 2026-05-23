import { notFound } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";

import { createClient } from "@/lib/supabase/server";

import { SeatMap } from "@/components/seat-map/seat-map";

import { BookingSidebar } from "@/components/booking/booking-sidebar";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function FlightDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase =
    await createClient();

  const { data: flight } =
    await supabase
      .from("flights")
      .select("*")
      .eq("id", id)
      .single();

  if (!flight) {
    notFound();
  }

  const { data: seats } =
    await supabase
      .from("seats")
      .select("*")
      .eq("flight_id", id)
      .order("seat_number");

  return (
    <AppLayout>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_350px]">
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-black">
              {flight.origin} →{" "}
              {flight.destination}
            </h1>

            <p className="mt-2 text-gray-400">
              {flight.flight_no} •{" "}
              {
                flight.aircraft_type
              }
            </p>
          </div>

          <SeatMap
            initialSeats={seats || []}
            flightId={flight.id}
          />
        </div>

        <BookingSidebar
          flight={flight}
        />
      </div>
    </AppLayout>
  );
}