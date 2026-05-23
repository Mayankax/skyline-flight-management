"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";

import {
  CalendarIcon,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SearchForm() {
  const router = useRouter();

  const [origin, setOrigin] =
    useState("");

  const [
    destination,
    setDestination,
  ] = useState("");

  const [date, setDate] =
    useState<Date>();

  function handleSearch() {
    const params =
      new URLSearchParams();

    if (origin)
      params.set("origin", origin);

    if (destination)
      params.set(
        "destination",
        destination
      );

    if (date)
      params.set(
        "date",
        format(date, "yyyy-MM-dd")
      );

    router.push(
      `/flights?${params.toString()}`
    );
  }

  return (
    <div className="mt-10 grid w-full max-w-5xl gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:grid-cols-4">
      <Input
        placeholder="Origin"
        value={origin}
        onChange={(e) =>
          setOrigin(e.target.value)
        }
      />

      <Input
        placeholder="Destination"
        value={destination}
        onChange={(e) =>
          setDestination(
            e.target.value
          )
        }
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {date
              ? format(
                  date,
                  "PPP"
                )
              : "Select Date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={handleSearch}
        className="h-10"
      >
        <Search className="mr-2 h-4 w-4" />

        Search Flights
      </Button>
    </div>
  );
}