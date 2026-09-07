import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { FrontendAppointment } from "@/types/appointment";

type AppointmentStore = {
  lastAppointment: FrontendAppointment | null;

  setLastAppointment: (
    appointment: FrontendAppointment
  ) => void;

  clearLastAppointment: () => void;
};

export const useAppointmentStore =
  create<AppointmentStore>()(
    persist(
      (set) => ({
        lastAppointment: null,

        setLastAppointment: (appointment) => {
          set({
            lastAppointment: appointment,
          });
        },

        clearLastAppointment: () => {
          set({
            lastAppointment: null,
          });
        },
      }),
      {
        name: "homeopathy-clinic-last-appointment",
      }
    )
  );