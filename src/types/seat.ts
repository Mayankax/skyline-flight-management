export interface Seat {
  id: string;

  seat_number: string;

  class: "economy" | "business" | "first";

  is_available: boolean;

  extra_fee: number;

  flight_id: string;
}