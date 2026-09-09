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
  PackageCheck,
  ShoppingBag,
  Star,
} from "lucide-react";

type DashboardData = {
  user: {
    name: string;

    email: string;
  };

  stats: {
    totalOrders: number;

    deliveredOrders: number;

    pendingOrders: number;

    totalSpent: number;

    totalAppointments: number;

    confirmedAppointments: number;

    totalReviews: number;
  };

  recentOrders: {
    id: string;

    orderNumber: string;

    total: number;

    status: string;

    createdAt: string;
  }[];
};

export default function CustomerDashboardOverview() {
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
              "/api/dashboard/customer",
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
      <div className="py-20">
        <Loader2
          size={30}
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
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  const {
    stats,
  } = data;

  const cards = [
    {
      title:
        "আমার Orders",

      value:
        stats.totalOrders,

      subtitle:
        `${stats.pendingOrders} Active`,

      icon:
        ShoppingBag,

      href:
        "/account/orders",
    },

    {
      title:
        "Delivered",

      value:
        stats.deliveredOrders,

      subtitle:
        "Completed Orders",

      icon:
        PackageCheck,

      href:
        "/account/orders",
    },

    {
      title:
        "Total Purchase",

      value:
        `৳${stats.totalSpent.toLocaleString()}`,

      subtitle:
        "Delivered Orders",

      icon:
        CircleDollarSign,

      href:
        "/account/orders",
    },

    {
      title:
        "Appointments",

      value:
        stats.totalAppointments,

      subtitle:
        `${stats.confirmedAppointments} Confirmed`,

      icon:
        CalendarDays,

      href:
        "/account/appointments",
    },

    {
      title:
        "Reviews",

      value:
        stats.totalReviews,

      subtitle:
        "Submitted Reviews",

      icon:
        Star,

      href:
        "/reviews",
    },
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          My Account
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          স্বাগতম,{" "}
          {data.user.name}
        </h1>

        <p className="font-english mt-2 text-sm text-gray-400">
          {
            data.user.email
          }
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(
          (card) => {
            const Icon =
              card.icon;

            return (
              <Link
                key={
                  card.title
                }
                href={
                  card.href
                }
                className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
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

                <p className="mt-1 font-semibold">
                  {
                    card.title
                  }
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {
                    card.subtitle
                  }
                </p>
              </Link>
            );
          }
        )}
      </div>

      <div className="mt-8 rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>

          <Link
            href="/account/orders"
            className="text-sm font-semibold text-[#14532D]"
          >
            সব দেখুন
          </Link>
        </div>

        {data.recentOrders.length >
        0 ? (
          <div className="mt-5 divide-y">
            {data.recentOrders.map(
              (order) => (
                <div
                  key={
                    order.id
                  }
                  className="flex justify-between gap-4 py-4"
                >
                  <div>
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
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ৳
                      {
                        order.total
                      }
                    </p>

                    <p className="mt-1 text-xs uppercase text-gray-400">
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