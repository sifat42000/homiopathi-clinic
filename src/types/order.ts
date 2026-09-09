export type PaymentMethod =
  "cod";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderPaymentStatus =
  | "unpaid"
  | "paid";

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

export type OrderItem = {
  productId: number;

  productName: string;

  englishName: string;

  slug: string;

  sku: string;

  quantity: number;

  unitPrice: number;

  lineTotal: number;

  imageUrl?: string;
};

export type OrderStatusHistory = {
  status: OrderStatus;

  at: string;
};

export type DatabaseOrder = {
  id: string;

  orderNumber: string;

  userId?: string | null;

  customer: OrderCustomer;

  shippingAddress: OrderAddress;

  items: OrderItem[];

  subtotal: number;

  deliveryCharge: number;

  total: number;

  paymentMethod: "cod";

  paymentStatus:
    OrderPaymentStatus;

  status: OrderStatus;

  orderNote?: string;

  statusHistory:
    OrderStatusHistory[];

  createdAt: string;

  updatedAt: string;
};

/*
  পুরনো Frontend type import
  কোথাও থাকলে build না ভাঙার জন্য।
*/
export type FrontendOrder =
  DatabaseOrder;