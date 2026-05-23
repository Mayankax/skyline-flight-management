"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import {
  bookingSchema,
  type BookingSchemaType,
} from "@/lib/validations/booking.schema";

import { createBooking } from "@/actions/booking.actions";

import { useFlightStore } from "@/stores/flight-store";

import type { Flight } from "@/types/flight";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface Props {
  flight: Flight;
}

export function PassengerForm({
  flight,
}: Props) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const {
    selectedSeatId,
    selectedSeatData,
    resetBooking,
  } = useFlightStore();

  const form =
    useForm<BookingSchemaType>({
      resolver:
        zodResolver(
          bookingSchema
        ),

      defaultValues: {
        fullName: "",
        passportNo: "",
        nationality: "",
        dob: "",
      },
    });

  function onSubmit(
    values: BookingSchemaType
  ) {
    if (!selectedSeatId) {
      toast.error(
        "Please select a seat"
      );

      return;
    }

    startTransition(async () => {
      const total =
        flight.base_price +
        (selectedSeatData?.extraFee ||
          0);

      const result =
        await createBooking({
          flightId: flight.id,

          seatId:
            selectedSeatId,

          totalPrice: total,

          passenger: values,
        });

      if (result?.error) {
        toast.error(
          result.error
        );

        return;
      }

      toast.success(
        "Booking confirmed"
      );

      resetBooking();

      router.push(
        `/booking-confirmation/${result.bookingId}`
      );
    });
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-black">
          Passenger Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Full Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Passenger full name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passportNo"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Passport Number
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Passport number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Nationality
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Nationality"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Date of Birth
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={pending}
              className="h-12 w-full"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}