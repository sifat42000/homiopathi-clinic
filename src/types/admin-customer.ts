import type {
  DatabaseOrder,
} from "@/types/order";

import type {
  DatabaseAppointment,
} from "@/types/appointment";

import type {
  DatabaseReview,
} from "@/types/review";

export type AdminCustomerSummary = {
  userId: string;

  name: string;

  email: string;

  phone: string;

  createdAt?: string;

  totalOrders: number;

  deliveredOrders: number;

  totalPurchase: number;

  totalAppointments: number;

  totalReviews: number;

  lastOrderAt?: string;
};

export type AdminCustomerDetails =
  AdminCustomerSummary & {
    profile: {
      division: string;

      district: string;

      area: string;

      address: string;
    };

    orders:
      DatabaseOrder[];

    appointments:
      DatabaseAppointment[];

    reviews:
      DatabaseReview[];
  };