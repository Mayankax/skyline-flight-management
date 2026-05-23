import { AppLayout } from "@/components/layout/app-layout";

import { createClient } from "@/lib/supabase/server";

import { FlightCard } from "@/components/flight/flight-card";

interface Props {
  searchParams: Promise<{
    origin?: string;

    destination?: string;
  }>;
}

export default async function FlightsPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const supabase =
    await createClient();

  let query = supabase
    .from("flights")
    .select("*");

  if (params.origin) {
    query = query.ilike(
      "origin",
      `%${params.origin}%`
    );
  }

  if (params.destination) {
    query = query.ilike(
      "destination",
      `%${params.destination}%`
    );
  }

  const { data: flights } =
    await query.order(
      "departs_at",
      {
        ascending: true,
      }
    );

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black">
            Available Flights
          </h1>

          <p className="mt-2 text-gray-400">
            Find the best route for
            your journey.
          </p>
        </div>

        <div className="grid gap-6">
          {flights?.map(
            (flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
              />
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
}