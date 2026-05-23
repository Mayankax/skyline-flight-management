import { createClient } from "@/lib/supabase/server";

import { BookingCard } from "@/components/booking/booking-card";

export default async function MyBookingsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const { data: bookings } =
    await supabase
      .from("bookings")
      .select(`
        *,
        flights (*),
        seats (*)
      `)
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-5xl font-black">
          My Bookings
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your upcoming
          flights and reservations.
        </p>
      </div>

      <div className="grid gap-6">
        {bookings?.map(
          (booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
            />
          )
        )}
      </div>
    </div>
  );
}