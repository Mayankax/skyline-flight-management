import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PassengerForm } from "@/components/booking/passenger-form";

interface Props {
  params: Promise<{
    flightId: string;
  }>;
}

export default async function BookingPage({
  params,
}: Props) {
  const { flightId } =
    await params;

  const supabase =
    await createClient();

  const { data: flight } =
    await supabase
      .from("flights")
      .select("*")
      .eq("id", flightId)
      .single();

  if (!flight) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PassengerForm
        flight={flight}
      />
    </div>
  );
}