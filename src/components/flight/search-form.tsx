"use client";

import { useState } from "react";

import Link from "next/link";

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
    <div className="relative z-20 mt-10 grid w-full max-w-5xl gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:grid-cols-4">
      <Input
        placeholder="Origin"
        value={origin}
        onChange={(e) =>
          setOrigin(e.target.value)
        }
        className="h-12 border-white/10 bg-white/3 text-white placeholder:text-gray-500"
      />

      <Input
        placeholder="Destination"
        value={destination}
        onChange={(e) =>
          setDestination(
            e.target.value
          )
        }
        className="h-12 border-white/10 bg-white/3 text-white placeholder:text-gray-500"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-12 justify-start border-white/10 bg-white/3 text-left text-white hover:bg-white/10"
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

        <PopoverContent
          align="start"
          className="z-100 w-auto border-white/10 bg-[#081120]/95 p-0 backdrop-blur-2xl"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={handleSearch}
        className="h-12 bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
      >
        <Search className="mr-2 h-4 w-4" />

        Search Flights
      </Button>
    </div>
  );
}