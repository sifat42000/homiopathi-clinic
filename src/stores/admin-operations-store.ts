import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  treatments,
  type Treatment,
} from "@/data/treatments";

export type AdminOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AdminAppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type AdminOrder = {
  id: string;
  orderNumber: string;

  customerId: string;
  customerName: string;
  phone: string;

  itemCount: number;
  total: number;

  paymentMethod: string;

  status: AdminOrderStatus;

  createdAt: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  phone: string;
  email?: string;

  totalOrders: number;
  totalSpent: number;

  active: boolean;

  createdAt: string;
};

export type AdminAppointment = {
  id: string;
  appointmentNumber: string;

  patientName: string;
  phone: string;

  treatment: string;

  date: string;
  time: string;

  fee: number;

  status: AdminAppointmentStatus;

  createdAt: string;
};

export type AdminTreatment = Treatment & {
  active: boolean;
};

type TreatmentWithoutId = Omit<
  Treatment,
  "id"
>;

type AdminOperationsStore = {
  orders: AdminOrder[];

  customers: AdminCustomer[];

  appointments: AdminAppointment[];

  treatments: AdminTreatment[];

  updateOrderStatus: (
    id: string,
    status: AdminOrderStatus
  ) => void;

  toggleCustomerStatus: (
    id: string
  ) => void;

  updateAppointmentStatus: (
    id: string,
    status: AdminAppointmentStatus
  ) => void;

  addTreatment: (
    treatment: TreatmentWithoutId
  ) => void;

  updateTreatment: (
    id: number,
    treatment: TreatmentWithoutId
  ) => void;

  deleteTreatment: (
    id: number
  ) => boolean;

  toggleTreatmentStatus: (
    id: number
  ) => void;
};

const initialOrders: AdminOrder[] = [
  {
    id: "order-1",
    orderNumber: "HC-100001",
    customerId: "customer-1",
    customerName: "রহিম আহমেদ",
    phone: "01712345678",
    itemCount: 2,
    total: 1180,
    paymentMethod: "Cash on Delivery",
    status: "pending",
    createdAt: "2026-09-07T08:20:00.000Z",
  },
  {
    id: "order-2",
    orderNumber: "HC-100002",
    customerId: "customer-2",
    customerName: "সাবিহা ইসলাম",
    phone: "01812345678",
    itemCount: 1,
    total: 560,
    paymentMethod: "Cash on Delivery",
    status: "confirmed",
    createdAt: "2026-09-06T10:15:00.000Z",
  },
  {
    id: "order-3",
    orderNumber: "HC-100003",
    customerId: "customer-3",
    customerName: "মো. হাসান",
    phone: "01912345678",
    itemCount: 3,
    total: 1760,
    paymentMethod: "Cash on Delivery",
    status: "processing",
    createdAt: "2026-09-05T12:30:00.000Z",
  },
  {
    id: "order-4",
    orderNumber: "HC-100004",
    customerId: "customer-1",
    customerName: "রহিম আহমেদ",
    phone: "01712345678",
    itemCount: 1,
    total: 630,
    paymentMethod: "Cash on Delivery",
    status: "delivered",
    createdAt: "2026-09-01T09:10:00.000Z",
  },
];

const initialCustomers: AdminCustomer[] = [
  {
    id: "customer-1",
    name: "রহিম আহমেদ",
    phone: "01712345678",
    email: "rahim@example.com",
    totalOrders: 2,
    totalSpent: 1810,
    active: true,
    createdAt: "2026-08-10T00:00:00.000Z",
  },
  {
    id: "customer-2",
    name: "সাবিহা ইসলাম",
    phone: "01812345678",
    email: "sabiha@example.com",
    totalOrders: 1,
    totalSpent: 560,
    active: true,
    createdAt: "2026-08-18T00:00:00.000Z",
  },
  {
    id: "customer-3",
    name: "মো. হাসান",
    phone: "01912345678",
    totalOrders: 1,
    totalSpent: 1760,
    active: true,
    createdAt: "2026-08-23T00:00:00.000Z",
  },
];

const initialAppointments: AdminAppointment[] = [
  {
    id: "appointment-1",
    appointmentNumber: "APT-100001",
    patientName: "তানিয়া রহমান",
    phone: "01798765432",
    treatment: "সাধারণ স্বাস্থ্য পরামর্শ",
    date: "2026-09-08",
    time: "10:30 AM",
    fee: 500,
    status: "pending",
    createdAt: "2026-09-07T07:10:00.000Z",
  },
  {
    id: "appointment-2",
    appointmentNumber: "APT-100002",
    patientName: "সাব্বির হোসেন",
    phone: "01898765432",
    treatment: "ত্বক ও চুলের পরামর্শ",
    date: "2026-09-08",
    time: "05:00 PM",
    fee: 600,
    status: "confirmed",
    createdAt: "2026-09-06T09:00:00.000Z",
  },
  {
    id: "appointment-3",
    appointmentNumber: "APT-100003",
    patientName: "নাসরিন আক্তার",
    phone: "01998765432",
    treatment: "হজম ও পেটের সমস্যা",
    date: "2026-09-09",
    time: "06:30 PM",
    fee: 550,
    status: "pending",
    createdAt: "2026-09-06T11:30:00.000Z",
  },
];

const initialTreatments: AdminTreatment[] =
  treatments.map((treatment) => ({
    ...treatment,
    active: true,
  }));

export const useAdminOperationsStore =
  create<AdminOperationsStore>()(
    persist(
      (set, get) => ({
        orders: initialOrders,

        customers: initialCustomers,

        appointments:
          initialAppointments,

        treatments:
          initialTreatments,

        updateOrderStatus: (
          id,
          status
        ) =>
          set((state) => ({
            orders:
              state.orders.map(
                (order) =>
                  order.id === id
                    ? {
                        ...order,
                        status,
                      }
                    : order
              ),
          })),

        toggleCustomerStatus: (
          id
        ) =>
          set((state) => ({
            customers:
              state.customers.map(
                (customer) =>
                  customer.id === id
                    ? {
                        ...customer,
                        active:
                          !customer.active,
                      }
                    : customer
              ),
          })),

        updateAppointmentStatus: (
          id,
          status
        ) =>
          set((state) => ({
            appointments:
              state.appointments.map(
                (appointment) =>
                  appointment.id === id
                    ? {
                        ...appointment,
                        status,
                      }
                    : appointment
              ),
          })),

        addTreatment: (
          treatment
        ) =>
          set((state) => {
            const nextId =
              state.treatments.length >
              0
                ? Math.max(
                    ...state.treatments.map(
                      (item) =>
                        item.id
                    )
                  ) + 1
                : 1;

            return {
              treatments: [
                ...state.treatments,
                {
                  ...treatment,
                  id: nextId,
                  active: true,
                },
              ],
            };
          }),

        updateTreatment: (
          id,
          treatment
        ) =>
          set((state) => ({
            treatments:
              state.treatments.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        ...treatment,
                      }
                    : item
              ),
          })),

        deleteTreatment: (
          id
        ) => {
          const treatment =
            get().treatments.find(
              (item) =>
                item.id === id
            );

          if (!treatment) {
            return false;
          }

          const usedInAppointment =
            get().appointments.some(
              (appointment) =>
                appointment.treatment ===
                treatment.title
            );

          if (usedInAppointment) {
            return false;
          }

          set((state) => ({
            treatments:
              state.treatments.filter(
                (item) =>
                  item.id !== id
              ),
          }));

          return true;
        },

        toggleTreatmentStatus: (
          id
        ) =>
          set((state) => ({
            treatments:
              state.treatments.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        active:
                          !item.active,
                      }
                    : item
              ),
          })),
      }),
      {
        name:
          "homeopathy-admin-operations",
      }
    )
  );