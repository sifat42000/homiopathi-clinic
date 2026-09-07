import type { CartItem } from "@/stores/cart-store";

export type PaymentMethod = "cod" | "online";

export type OrderCustomer = {
  name: string;
  phone: string;
  email?: string;
};

export type OrderAddress = {
  division: string;
  district: string;
  area: string;
  address: string;
};

export type FrontendOrder = {
  orderNumber: string;

  customer: OrderCustomer;

  shippingAddress: OrderAddress;

  items: CartItem[];

  subtotal: number;
  deliveryCharge: number;
  total: number;

  paymentMethod: PaymentMethod;

  orderNote?: string;

  status: "pending";

  createdAt: string;
};