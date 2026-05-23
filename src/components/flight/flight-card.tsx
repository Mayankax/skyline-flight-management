import Link from "next/link";

import {
  Plane,
  Clock3,
} from "lucide-react";

import { format } from "date-fns";

import type { Flight } from "@/types/flight";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  flight: Flight;
}

export function FlightCard({
  flight,
}: Props) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="rounded-2xl bg-blue-500/10 p-4">
            <Plane className="h-8 w-8 text-blue-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {flight.origin} →{" "}
              {flight.destination}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {flight.flight_no} •{" "}
              {
                flight.aircraft_type
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-gray-400">
              Departure
            </p>

            <p className="font-semibold">
              {format(
                new Date(
                  flight.departs_at
                ),
                "PPP p"
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Price
            </p>

            <p className="text-2xl font-black text-blue-400">
              ₹
              {flight.base_price}
            </p>
          </div>

          <Link
            href={`/flights/${flight.id}`}
          >
            <Button>
              Select Flight
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}