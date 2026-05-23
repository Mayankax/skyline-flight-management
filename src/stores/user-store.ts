import { create } from "zustand";

import { persist } from "zustand/middleware";

interface UserStore {
  accessToken: string | null;

  setAccessToken: (
    token: string | null
  ) => void;

  clearSession: () => void;
}

export const useUserStore =
  create<UserStore>()(
    persist(
      (set) => ({
        accessToken: null,

        setAccessToken: (
          token
        ) =>
          set({
            accessToken: token,
          }),

        clearSession: () =>
          set({
            accessToken: null,
          }),
      }),
      {
        name: "user-store",

        partialize: (state) => ({
          accessToken:
            state.accessToken,
        }),
      }
    )
  );