"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  Search,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";

import {
  useAdminOperationsStore,
  type AdminOrderStatus,
} from "@/stores/admin-operations-store";

const statuses: {
  value: AdminOrderStatus;
  label: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "processing",
    label: "Processing",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

function statusClass(
  status: AdminOrderStatus
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
  const orders =
    useAdminOperationsStore(
      (state) => state.orders
    );

  const updateOrderStatus =
    useAdminOperationsStore(
      (state) =>
        state.updateOrderStatus
    );

  const [mounted, setMounted] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOrders =
    useMemo(() => {
      let result = [...orders];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result = result.filter(
          (order) =>
            order.orderNumber
              .toLowerCase()
              .includes(query) ||
            order.customerName
              .toLowerCase()
              .includes(query) ||
            order.phone.includes(
              query
            )
        );
      }

      if (
        statusFilter !== "all"
      ) {
        result = result.filter(
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

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Orders Loading...
      </div>
    );
  }

  const pendingCount =
    orders.filter(
      (order) =>
        order.status === "pending"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        order.status ===
        "delivered"
    ).length;

  const totalSales =
    orders
      .filter(
        (order) =>
          order.status !==
          "cancelled"
      )
      .reduce(
        (total, order) =>
          total + order.total,
        0
      );

  return (
    <div>
      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Sales
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Order Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Customer Order এবং Order Status Manage করুন।
        </p>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <ShoppingCart
            size={21}
            className="text-[#14532D]"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {orders.length}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Total Orders
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <Clock3
            size={21}
            className="text-amber-600"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {pendingCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Pending
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <CheckCircle2
            size={21}
            className="text-green-600"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {deliveredCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Delivered
          </p>
        </div>

        <div className="rounded-[22px] bg-[#14532D] p-5 text-white shadow-sm">
          <PackageCheck
            size={21}
          />

          <p className="mt-4 text-3xl font-bold">
            ৳{totalSales}
          </p>

          <p className="mt-1 text-sm text-green-100/70">
            Demo Sales Value
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Order Number, Customer অথবা Phone..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
        >
          <option value="all">
            All Status
          </option>

          {statuses.map(
            (status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-[#F7FBF8]">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">
                  Order
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Items
                </th>

                <th className="px-5 py-4">
                  Total
                </th>

                <th className="px-5 py-4">
                  Payment
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Change Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(
                (order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4">
                      <p className="font-english font-bold text-[#14532D]">
                        {
                          order.orderNumber
                        }
                      </p>

                      <p className="font-english mt-1 text-xs text-gray-400">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {
                          order.customerName
                        }
                      </p>

                      <p className="font-english mt-1 text-xs text-gray-400">
                        {order.phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-english text-sm">
                      {
                        order.itemCount
                      }
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-900">
                      ৳{order.total}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {
                        order.paymentMethod
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          order.status
                        )}`}
                      >
                        {
                          order.status
                        }
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={
                          order.status
                        }
                        onChange={(
                          event
                        ) =>
                          updateOrderStatus(
                            order.id,
                            event
                              .target
                              .value as AdminOrderStatus
                          )
                        }
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#14532D]"
                      >
                        {statuses.map(
                          (
                            status
                          ) => (
                            <option
                              key={
                                status.value
                              }
                              value={
                                status.value
                              }
                            >
                              {
                                status.label
                              }
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {filteredOrders.length ===
          0 && (
          <div className="py-14 text-center">
            <XCircle
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-400">
              কোনো Order পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        এগুলো এখন Demo Admin Order। Backend-এর পরে Checkout থেকে আসল Order
        MongoDB-তে Save হবে এবং এই Table-এ automatically আসবে।
      </div>
    </div>
  );
}