"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Loader2,
  Package,
} from "lucide-react";

import type {
  DatabaseOrder,
} from "@/types/order";

export default function CustomerOrdersList() {
  const [
    orders,
    setOrders,
  ] = useState<
    DatabaseOrder[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadOrders =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/orders?mine=1",
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

        setOrders(
          data.orders
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Order History load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <div className="py-16">
        <Loader2
          size={30}
          className="mx-auto animate-spin text-[#14532D]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (
    orders.length === 0
  ) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <Package
          size={40}
          className="mx-auto text-gray-300"
        />

        <h2 className="mt-4 text-xl font-bold">
          কোনো Order নেই
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Login অবস্থায় করা Order এখানে দেখা যাবে।
        </p>

        <Link
          href="/products"
          className="mt-5 inline-flex rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
        >
          Product দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(
        (order) => (
          <article
            key={order.id}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="font-english font-bold text-[#14532D]">
                  {
                    order.orderNumber
                  }
                </p>

                <p className="font-english mt-1 text-xs text-gray-400">
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xl font-bold">
                  ৳
                  {order.total}
                </p>

                <p className="mt-1 text-xs font-semibold uppercase text-[#15803D]">
                  {
                    order.status
                  }
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
              {order.items.map(
                (item) => (
                  <div
                    key={
                      item.productId
                    }
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span>
                      {
                        item.productName
                      }{" "}
                      ×{" "}
                      {
                        item.quantity
                      }
                    </span>

                    <span>
                      ৳
                      {
                        item.lineTotal
                      }
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 rounded-xl bg-[#F7FBF8] px-4 py-3 text-xs text-gray-500">
              Payment: Cash on Delivery •{" "}
              {order.paymentStatus ===
              "paid"
                ? "Paid"
                : "Unpaid"}
            </div>
          </article>
        )
      )}
    </div>
  );
}