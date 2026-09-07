import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { FrontendOrder } from "@/types/order";

type OrderStore = {
  lastOrder: FrontendOrder | null;

  setLastOrder: (order: FrontendOrder) => void;

  clearLastOrder: () => void;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      lastOrder: null,

      setLastOrder: (order) => {
        set({
          lastOrder: order,
        });
      },

      clearLastOrder: () => {
        set({
          lastOrder: null,
        });
      },
    }),
    {
      name: "homeopathy-clinic-last-order",
    }
  )
);