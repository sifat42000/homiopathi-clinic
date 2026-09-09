"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  CalendarDays,
  CircleDollarSign,
  Loader2,
  Package,
  ShoppingCart,
  Star,
  TriangleAlert,
  Users,
} from "lucide-react";

type DashboardData = {
  stats: {
    totalUsers: number;

    totalProducts: number;

    activeProducts: number;

    lowStockProducts: number;

    totalOrders: number;

    pendingOrders: number;

    deliveredOrders: number;

    deliveredRevenue: number;

    pendingAppointments: number;

    confirmedAppointments: number;

    pendingReviews: number;
  };

  recentOrders: {
    id: string;

    orderNumber: string;

    customerName: string;

    total: number;

    status: string;

    createdAt: string;
  }[];
};

export default function AdminDashboardOverview() {
  const [
    data,
    setData,
  ] = useState<
    DashboardData | null
  >(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          const response =
            await fetch(
              "/api/dashboard/admin",
              {
                cache:
                  "no-store",
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message
            );
          }

          setData(result);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Dashboard load করা যায়নি।"
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <Loader2
          size={32}
          className="mx-auto animate-spin text-[#14532D]"
        />
      </div>
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {error ||
          "Dashboard পাওয়া যায়নি।"}
      </div>
    );
  }

  const {
    stats,
  } = data;

  const cards = [
    {
      title:
        "Total Orders",

      value:
        stats.totalOrders,

      subtitle:
        `${stats.pendingOrders} Pending`,

      icon:
        ShoppingCart,
    },

    {
      title:
        "Delivered Sales",

      value:
        `৳${stats.deliveredRevenue.toLocaleString()}`,

      subtitle:
        `${stats.deliveredOrders} Delivered`,

      icon:
        CircleDollarSign,
    },

    {
      title:
        "Customers",

      value:
        stats.totalUsers,

      subtitle:
        "Registered Users",

      icon:
        Users,
    },

    {
      title:
        "Products",

      value:
        stats.totalProducts,

      subtitle:
        `${stats.activeProducts} Active`,

      icon:
        Package,
    },

    {
      title:
        "Pending Appointment",

      value:
        stats.pendingAppointments,

      subtitle:
        `${stats.confirmedAppointments} Confirmed`,

      icon:
        CalendarDays,
    },

    {
      title:
        "Pending Reviews",

      value:
        stats.pendingReviews,

      subtitle:
        "Need Moderation",

      icon:
        Star,
    },

    {
      title:
        "Low Stock",

      value:
        stats.lowStockProducts,

      subtitle:
        "Stock ≤ 5",

      icon:
        TriangleAlert,
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Live Overview
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Dashboard-এর সব Number এখন MongoDB-এর Real Data।
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <div
                key={
                  card.title
                }
                className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                  <Icon
                    size={21}
                  />
                </div>

                <p className="font-english mt-5 text-3xl font-bold text-gray-900">
                  {
                    card.value
                  }
                </p>

                <p className="mt-1 font-semibold text-gray-700">
                  {
                    card.title
                  }
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {
                    card.subtitle
                  }
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* Recent Orders */}
      <div className="mt-8 rounded-[26px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              সর্বশেষ ৫টি Order
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-[#14532D]"
          >
            সব দেখুন
          </Link>
        </div>

        {data.recentOrders.length >
        0 ? (
          <div className="mt-5 divide-y divide-gray-100">
            {data.recentOrders.map(
              (order) => (
                <div
                  key={
                    order.id
                  }
                  className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-english font-bold text-[#14532D]">
                      {
                        order.orderNumber
                      }
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {
                        order.customerName
                      }
                    </p>

                    <p className="font-english mt-1 text-xs text-gray-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-lg font-bold">
                      ৳
                      {
                        order.total
                      }
                    </p>

                    <p className="mt-1 text-xs font-semibold uppercase text-gray-400">
                      {
                        order.status
                      }
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-400">
            এখনো কোনো Order নেই।
          </div>
        )}
      </div>
    </div>
  );
}