import { z } from "zod";

export const bookingSchema =
  z.object({
    fullName: z
      .string()
      .min(2),

    passportNo: z
      .string()
      .min(6),

    nationality: z
      .string()
      .min(2),

    dob: z.string(),
  });

export type BookingSchemaType =
  z.infer<
    typeof bookingSchema
  >;