import type {
  ObjectId,
} from "mongodb";

import type {
  OrderAddress,
  OrderCustomer,
  OrderItem,
  OrderPaymentStatus,
  OrderStatus,
  DatabaseOrder,
} from "@/types/order";

export type OrderDocument = {
  _id?: ObjectId;

  orderNumber: string;

  userId?: string | null;

  customer: OrderCustomer;

  shippingAddress:
    OrderAddress;

  items: OrderItem[];

  subtotal: number;

  deliveryCharge: number;

  total: number;

  paymentMethod: "cod";

  paymentStatus:
    OrderPaymentStatus;

  status: OrderStatus;

  orderNote?: string;

  statusHistory: {
    status: OrderStatus;

    at: Date;
  }[];

  createdAt: Date;

  updatedAt: Date;
};

export function serializeOrder(
  order: OrderDocument & {
    _id: ObjectId;
  }
): DatabaseOrder {
  return {
    id:
      order._id.toString(),

    orderNumber:
      order.orderNumber,

    userId:
      order.userId,

    customer:
      order.customer,

    shippingAddress:
      order.shippingAddress,

    items:
      order.items,

    subtotal:
      order.subtotal,

    deliveryCharge:
      order.deliveryCharge,

    total:
      order.total,

    paymentMethod:
      "cod",

    paymentStatus:
      order.paymentStatus,

    status:
      order.status,

    orderNote:
      order.orderNote,

    statusHistory:
      order.statusHistory.map(
        (history) => ({
          status:
            history.status,

          at:
            history.at.toISOString(),
        })
      ),

    createdAt:
      order.createdAt.toISOString(),

    updatedAt:
      order.updatedAt.toISOString(),
  };
}