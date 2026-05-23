import { create } from "zustand";

import { persist } from "zustand/middleware";

interface FlightStore {
  selectedFlightId: string | null;

  selectedSeatId: string | null;

  selectedSeatData: {
    seatNumber: string;
    class: string;
    extraFee: number;
  } | null;

  bookingStep: number;

  passengerData: {
    fullName: string;
    nationality: string;
  };

  setSelectedFlightId: (
    id: string
  ) => void;

  setSelectedSeatId: (
    id: string
  ) => void;

  setSelectedSeatData: (
    data: {
      seatNumber: string;
      class: string;
      extraFee: number;
    } | null
  ) => void;

  setBookingStep: (
    step: number
  ) => void;

  setPassengerData: (
    data: {
      fullName: string;
      nationality: string;
    }
  ) => void;

  resetBooking: () => void;
}

export const useFlightStore =
  create<FlightStore>()(
    persist(
      (set) => ({
        selectedFlightId: null,

        selectedSeatId: null,

        selectedSeatData: null,

        bookingStep: 1,

        passengerData: {
          fullName: "",
          nationality: "",
        },

        setSelectedFlightId: (
          id
        ) =>
          set({
            selectedFlightId: id,
          }),

        setSelectedSeatId: (id) =>
          set({
            selectedSeatId: id,
          }),

        setSelectedSeatData: (
          data
        ) =>
          set({
            selectedSeatData: data,
          }),

        setBookingStep: (step) =>
          set({
            bookingStep: step,
          }),

        setPassengerData: (
          data
        ) =>
          set({
            passengerData: data,
          }),

        resetBooking: () =>
          set({
            selectedFlightId: null,

            selectedSeatId: null,

            selectedSeatData: null,

            bookingStep: 1,

            passengerData: {
              fullName: "",
              nationality: "",
            },
          }),
      }),
      {
        name: "flight-store",

        partialize: (state) => ({
          selectedFlightId:
            state.selectedFlightId,

          selectedSeatId:
            state.selectedSeatId,

          selectedSeatData:
            state.selectedSeatData,

          bookingStep:
            state.bookingStep,

          passengerData: {
            fullName:
              state.passengerData
                .fullName,

            nationality:
              state.passengerData
                .nationality,
          },
        }),
      }
    )
  );