"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface BookingPayload {
  flightId: string;

  seatId: string;

  totalPrice: number;

  passenger: {
    fullName: string;

    passportNo: string;

    nationality: string;

    dob: string;
  };
}

export async function createBooking(
  payload: BookingPayload
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return {
      error:
        "Unauthorized access",
    };
  }

  const {
    data: bookingId,
    error,
  } = await supabase.rpc(
    "reserve_seat",
    {
      p_flight_id:
        payload.flightId,

      p_seat_id:
        payload.seatId,

      p_user_id: user.id,

      p_total_price:
        payload.totalPrice,
    }
  );

  if (error) {
    return {
      error: error.message,
    };
  }

  const {
    error: passengerError,
  } = await supabase
    .from("passengers")
    .insert({
      booking_id: bookingId,

      full_name:
        payload.passenger
          .fullName,

      passport_no:
        payload.passenger
          .passportNo,

      nationality:
        payload.passenger
          .nationality,

      dob: payload.passenger
        .dob,
    });

  if (passengerError) {
    return {
      error:
        passengerError.message,
    };
  }

  revalidatePath(
    `/flights/${payload.flightId}`
  );

  return {
    success: true,

    bookingId,
  };
}


export async function cancelBooking(
  bookingId: string
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase.rpc(
      "cancel_booking",
      {
        p_booking_id:
          bookingId,
      }
    );

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath(
    "/my-bookings"
  );

  return {
    success: true,
  };
}

export async function rescheduleBooking(
  bookingId: string,
  newFlightId: string
) {
  const supabase =
    await createClient();

  const {
    data: existingBooking,
  } = await supabase
    .from("bookings")
    .select(`
      *,
      flights (*)
    `)
    .eq("id", bookingId)
    .single();

  if (!existingBooking) {
    return {
      error:
        "Booking not found",
    };
  }

  const {
    data: newFlight,
  } = await supabase
    .from("flights")
    .select("*")
    .eq("id", newFlightId)
    .single();

  if (!newFlight) {
    return {
      error:
        "Flight not found",
    };
  }

  const fee =
    Math.max(
      0,
      newFlight.base_price -
        existingBooking
          .flights.base_price
    );

  const {
    error: rescheduleError,
  } = await supabase
    .from("reschedules")
    .insert({
      booking_id: bookingId,

      old_flight_id:
        existingBooking.flight_id,

      new_flight_id:
        newFlightId,

      fee_charged: fee,
    });

  if (rescheduleError) {
    return {
      error:
        rescheduleError.message,
    };
  }

  const {
    error: updateError,
  } = await supabase
    .from("bookings")
    .update({
      flight_id: newFlightId,

      status: "rescheduled",

      total_price:
        existingBooking.total_price +
        fee,
    })
    .eq("id", bookingId);

  if (updateError) {
    return {
      error:
        updateError.message,
    };
  }

  revalidatePath(
    "/my-bookings"
  );

  return {
    success: true,
  };
}