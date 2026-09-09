"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  PackageCheck,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";

import type {
  DatabaseOrder,
  OrderStatus,
} from "@/types/order";

const statusLabels: Record<
  OrderStatus,
  string
> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const nextStatuses: Record<
  OrderStatus,
  OrderStatus[]
> = {
  pending: [
    "confirmed",
    "cancelled",
  ],

  confirmed: [
    "processing",
    "cancelled",
  ],

  processing: [
    "shipped",
    "cancelled",
  ],

  shipped: [
    "delivered",
  ],

  delivered: [],

  cancelled: [],
};

function statusClass(
  status: OrderStatus
) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "processing":
      return "bg-purple-50 text-purple-700";

    case "shipped":
      return "bg-cyan-50 text-cyan-700";

    case "delivered":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-600";
  }
}

export default function AdminOrdersManager() {
  const [
    orders,
    setOrders,
  ] = useState<
    DatabaseOrder[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [error, setError] =
    useState("");

  const loadOrders =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/orders?admin=1",
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
            : "Orders load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders =
    useMemo(() => {
      let result = [
        ...orders,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (order) =>
              order.orderNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              order.customer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              order.customer.phone.includes(
                query
              )
          );
      }

      if (
        statusFilter !==
        "all"
      ) {
        result =
          result.filter(
            (order) =>
              order.status ===
              statusFilter
          );
      }

      return result;
    }, [
      orders,
      search,
      statusFilter,
    ]);

  const updateStatus =
    async (
      order: DatabaseOrder,
      status: OrderStatus
    ) => {
      const confirmChange =
        window.confirm(
          `${order.orderNumber} → ${statusLabels[status]} করতে চান?`
        );

      if (!confirmChange) {
        return;
      }

      try {
        setError("");

        setUpdatingId(
          order.id
        );

        const response =
          await fetch(
            `/api/orders/${order.id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  status,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        await loadOrders();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Status Update করা যায়নি।"
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  const pending =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  const delivered =
    orders.filter(
      (order) =>
        order.status ===
        "delivered"
    ).length;

  const deliveredSales =
    orders
      .filter(
        (order) =>
          order.status ===
          "delivered"
      )
      .reduce(
        (total, order) =>
          total +
          order.total,
        0
      );

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Real Orders
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Order Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          সব Order এখন MongoDB Database থেকে আসছে।
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <ShoppingCart
            size={21}
            className="text-[#14532D]"
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {orders.length}
          </p>

          <p className="text-sm text-gray-500">
            Total Orders
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <Clock3
            size={21}
            className="text-amber-600"
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {pending}
          </p>

          <p className="text-sm text-gray-500">
            Pending
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <CheckCircle2
            size={21}
            className="text-green-600"
          />

          <p className="font-english mt-4 text-3xl font-bold">
            {delivered}
          </p>

          <p className="text-sm text-gray-500">
            Delivered
          </p>
        </div>

        <div className="rounded-[22px] bg-[#14532D] p-5 text-white">
          <PackageCheck
            size={21}
          />

          <p className="mt-4 text-3xl font-bold">
            ৳
            {
              deliveredSales
            }
          </p>

          <p className="text-sm text-green-100/70">
            Delivered Sales
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Order, Customer বা Phone Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4"
          />
        </div>

        <select
          value={
            statusFilter
          }
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="all">
            All Status
          </option>

          {Object.entries(
            statusLabels
          ).map(
            ([
              value,
              label,
            ]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            )
          )}
        </select>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredOrders.map(
            (order) => (
              <article
                key={order.id}
                className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-english font-bold text-[#14532D]">
                        {
                          order.orderNumber
                        }
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          order.status
                        )}`}
                      >
                        {
                          statusLabels[
                            order.status
                          ]
                        }
                      </span>

                      <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
                        COD
                      </span>
                    </div>

                    <h2 className="mt-4 font-bold text-gray-900">
                      {
                        order.customer
                          .name
                      }
                    </h2>

                    <p className="font-english mt-1 text-sm text-gray-500">
                      {
                        order.customer
                          .phone
                      }
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      {
                        order.shippingAddress
                          .address
                      }
                      ,{" "}
                      {
                        order.shippingAddress
                          .area
                      }
                      ,{" "}
                      {
                        order.shippingAddress
                          .district
                      }
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ৳
                      {
                        order.total
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        order.paymentStatus ===
                        "paid"
                          ? "COD Paid"
                          : "COD Unpaid"
                      }
                    </p>

                    <p className="font-english mt-2 text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#F7FBF8] p-4">
                  <p className="mb-3 text-xs font-bold uppercase text-gray-400">
                    Products
                  </p>

                  <div className="space-y-2">
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

                          <span className="font-semibold">
                            ৳
                            {
                              item.lineTotal
                            }
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {nextStatuses[
                  order.status
                ].length >
                  0 && (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    {nextStatuses[
                      order.status
                    ].map(
                      (status) => (
                        <button
                          key={
                            status
                          }
                          type="button"
                          disabled={
                            updatingId ===
                            order.id
                          }
                          onClick={() =>
                            updateStatus(
                              order,
                              status
                            )
                          }
                          className={`rounded-xl px-4 py-2.5 text-xs font-semibold disabled:opacity-50 ${
                            status ===
                            "cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-[#14532D] text-white"
                          }`}
                        >
                          {updatingId ===
                          order.id
                            ? "Updating..."
                            : statusLabels[
                                status
                              ]}
                        </button>
                      )
                    )}
                  </div>
                )}
              </article>
            )
          )}
        </div>
      )}

      {!loading &&
        filteredOrders.length ===
          0 && (
          <div className="mt-6 rounded-[24px] border border-dashed border-gray-200 bg-white py-16 text-center text-gray-400">
            কোনো Order পাওয়া যায়নি।
          </div>
        )}
    </div>
  );
}