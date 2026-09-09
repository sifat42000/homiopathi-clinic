"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  PackageCheck,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import type {
  OrderStatus,
} from "@/types/order";

type TrackingResult = {
  orderNumber: string;

  customerName: string;

  items: {
    productId: number;

    productName: string;

    quantity: number;

    lineTotal: number;
  }[];

  subtotal: number;

  deliveryCharge: number;

  total: number;

  paymentMethod: "cod";

  paymentStatus:
    "paid" | "unpaid";

  status: OrderStatus;

  statusHistory: {
    status: OrderStatus;

    at: string;
  }[];

  createdAt: string;
};

const labels: Record<
  OrderStatus,
  string
> = {
  pending:
    "Order Received",

  confirmed:
    "Order Confirmed",

  processing:
    "Processing",

  shipped:
    "Shipped",

  delivered:
    "Delivered",

  cancelled:
    "Cancelled",
};

export default function OrderTrackingForm() {
  const [
    order,
    setOrder,
  ] = useState<
    TrackingResult | null
  >(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    setOrder(null);

    const formData =
      new FormData(
        event.currentTarget
      );

    const orderNumber =
      String(
        formData.get(
          "orderNumber"
        ) ?? ""
      ).trim();

    const phone =
      String(
        formData.get(
          "phone"
        ) ?? ""
      ).trim();

    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/orders/track?orderNumber=${encodeURIComponent(
            orderNumber
          )}&phone=${encodeURIComponent(
            phone
          )}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
        );
      }

      setOrder(
        data.order
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Order পাওয়া যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Order Track করুন
        </h2>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          Order Number এবং Order-এর সময় দেওয়া Mobile Number ব্যবহার করুন।
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Order Number
            </label>

            <input
              name="orderNumber"
              required
              placeholder="HC-XXXXXXXXXX"
              className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Mobile Number
            </label>

            <input
              name="phone"
              required
              maxLength={11}
              placeholder="01XXXXXXXXX"
              className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Search
              size={18}
            />
          )}

          Track Order
        </button>

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <XCircle
              size={18}
            />

            {error}
          </div>
        )}
      </form>

      {order && (
        <div className="mt-6 rounded-[26px] border border-green-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-xs font-semibold text-gray-400">
                ORDER
              </p>

              <p className="font-english mt-1 text-lg font-bold text-[#14532D]">
                {
                  order.orderNumber
                }
              </p>
            </div>

            <div className="sm:text-right">
              <p className="font-bold text-gray-900">
                {
                  labels[
                    order.status
                  ]
                }
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Cash on Delivery
              </p>
            </div>
          </div>

          {/* History */}
          <div className="mt-7 space-y-4">
            {order.statusHistory.map(
              (
                history,
                index
              ) => (
                <div
                  key={`${history.status}-${index}`}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#15803D]">
                    {history.status ===
                    "delivered" ? (
                      <PackageCheck
                        size={17}
                      />
                    ) : history.status ===
                      "shipped" ? (
                      <Truck
                        size={17}
                      />
                    ) : history.status ===
                      "cancelled" ? (
                      <XCircle
                        size={17}
                      />
                    ) : history.status ===
                      "pending" ? (
                      <Clock3
                        size={17}
                      />
                    ) : (
                      <CheckCircle2
                        size={17}
                      />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {
                        labels[
                          history.status
                        ]
                      }
                    </p>

                    <p className="font-english mt-1 text-xs text-gray-400">
                      {new Date(
                        history.at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-7 rounded-2xl bg-[#F7FBF8] p-5">
            {order.items.map(
              (item) => (
                <div
                  key={
                    item.productId
                  }
                  className="flex justify-between gap-4 border-b border-gray-100 py-2 last:border-0"
                >
                  <span className="text-sm">
                    {
                      item.productName
                    }{" "}
                    ×{" "}
                    {
                      item.quantity
                    }
                  </span>

                  <span className="font-semibold">
                    ৳
                    {
                      item.lineTotal
                    }
                  </span>
                </div>
              )
            )}

            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
              <span>Total</span>

              <span className="text-[#14532D]">
                ৳
                {order.total}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}