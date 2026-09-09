"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Star,
  UserRound,
  X,
} from "lucide-react";

import type {
  AdminCustomerDetails,
  AdminCustomerSummary,
} from "@/types/admin-customer";

export default function AdminCustomersManager() {
  const [
    customers,
    setCustomers,
  ] = useState<
    AdminCustomerSummary[]
  >([]);

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<
    AdminCustomerDetails | null
  >(null);

  const [loading, setLoading] =
    useState(true);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const loadCustomers =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/admin/customers",
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

        setCustomers(
          data.customers ??
            []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Customers load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return customers;
      }

      return customers.filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(query) ||
          customer.email
            .toLowerCase()
            .includes(query) ||
          customer.phone.includes(
            query
          )
      );
    }, [
      customers,
      search,
    ]);

  const openCustomer =
    async (
      customer:
        AdminCustomerSummary
    ) => {
      try {
        setDetailsLoading(
          true
        );

        setError("");

        const response =
          await fetch(
            `/api/admin/customers/${encodeURIComponent(
              customer.userId
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

        setSelectedCustomer(
          data.customer
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Customer Details পাওয়া যায়নি।"
        );
      } finally {
        setDetailsLoading(
          false
        );
      }
    };

  const totalPurchase =
    customers.reduce(
      (
        total,
        customer
      ) =>
        total +
        customer.totalPurchase,
      0
    );

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Real Customers
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Customer Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Registered Customer, Order, Purchase এবং Appointment Information।
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <UserRound
            size={22}
            className="text-[#14532D]"
          />

          <p className="mt-4 text-3xl font-bold">
            {
              customers.length
            }
          </p>

          <p className="text-sm text-gray-500">
            Registered Customers
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <ShoppingCart
            size={22}
            className="text-[#14532D]"
          />

          <p className="mt-4 text-3xl font-bold">
            {customers.reduce(
              (
                total,
                customer
              ) =>
                total +
                customer.totalOrders,
              0
            )}
          </p>

          <p className="text-sm text-gray-500">
            Customer Orders
          </p>
        </div>

        <div className="rounded-[22px] bg-[#14532D] p-5 text-white">
          <Package
            size={22}
          />

          <p className="mt-4 text-3xl font-bold">
            ৳
            {totalPurchase.toLocaleString()}
          </p>

          <p className="text-sm text-green-100/70">
            Delivered Purchase
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-7 rounded-[22px] border border-gray-100 bg-white p-4">
        <div className="relative max-w-2xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Name, Email অথবা Phone Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-[#F7FBF8]">
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Phone
                  </th>

                  <th className="px-5 py-4">
                    Orders
                  </th>

                  <th className="px-5 py-4">
                    Purchase
                  </th>

                  <th className="px-5 py-4">
                    Appointment
                  </th>

                  <th className="px-5 py-4">
                    Reviews
                  </th>

                  <th className="px-5 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtered.map(
                  (customer) => (
                    <tr
                      key={
                        customer.userId
                      }
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {
                            customer.name
                          }
                        </p>

                        <p className="font-english mt-1 text-xs text-gray-400">
                          {
                            customer.email
                          }
                        </p>
                      </td>

                      <td className="font-english px-5 py-4 text-sm">
                        {customer.phone ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        {
                          customer.totalOrders
                        }
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        ৳
                        {customer.totalPurchase.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        {
                          customer.totalAppointments
                        }
                      </td>

                      <td className="px-5 py-4">
                        {
                          customer.totalReviews
                        }
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            openCustomer(
                              customer
                            )
                          }
                          className="rounded-xl bg-[#14532D] px-4 py-2 text-xs font-semibold text-white"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detailsLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="rounded-2xl bg-white p-7">
            <Loader2
              size={30}
              className="animate-spin text-[#14532D]"
            />
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 p-4">
          <div className="mx-auto my-6 max-w-5xl rounded-[28px] bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {
                    selectedCustomer.name
                  }
                </h2>

                <p className="font-english mt-1 text-sm text-gray-400">
                  {
                    selectedCustomer.email
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(
                    null
                  )
                }
                className="rounded-lg p-2"
              >
                <X size={21} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatBox
                label="Orders"
                value={
                  selectedCustomer.totalOrders
                }
              />

              <StatBox
                label="Delivered"
                value={
                  selectedCustomer.deliveredOrders
                }
              />

              <StatBox
                label="Purchase"
                value={`৳${selectedCustomer.totalPurchase.toLocaleString()}`}
              />

              <StatBox
                label="Appointments"
                value={
                  selectedCustomer.totalAppointments
                }
              />
            </div>

            <div className="mt-7 rounded-2xl bg-[#F7FBF8] p-5">
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <Phone
                    size={16}
                  />

                  {selectedCustomer.phone ||
                    "No Phone"}
                </p>

                <p className="flex items-center gap-2">
                  <Mail
                    size={16}
                  />

                  {
                    selectedCustomer.email
                  }
                </p>

                <p className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-1 shrink-0"
                  />

                  {[
                    selectedCustomer
                      .profile
                      .address,

                    selectedCustomer
                      .profile.area,

                    selectedCustomer
                      .profile
                      .district,

                    selectedCustomer
                      .profile
                      .division,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(", ") ||
                    "Address নেই"}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <ShoppingCart
                  size={20}
                />

                Orders
              </h3>

              <div className="mt-4 space-y-3">
                {selectedCustomer.orders.length >
                0 ? (
                  selectedCustomer.orders.map(
                    (order) => (
                      <div
                        key={
                          order.id
                        }
                        className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row"
                      >
                        <div>
                          <p className="font-english font-bold text-[#14532D]">
                            {
                              order.orderNumber
                            }
                          </p>

                          <p className="mt-1 text-xs uppercase text-gray-400">
                            {
                              order.status
                            }
                          </p>
                        </div>

                        <p className="font-bold">
                          ৳
                          {
                            order.total
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-400">
                    কোনো Order নেই।
                  </p>
                )}
              </div>
            </section>

            <section className="mt-8">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <CalendarDays
                  size={20}
                />

                Appointments
              </h3>

              <div className="mt-4 space-y-3">
                {selectedCustomer.appointments.length >
                0 ? (
                  selectedCustomer.appointments.map(
                    (
                      appointment
                    ) => (
                      <div
                        key={
                          appointment.id
                        }
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <p className="font-bold">
                          {
                            appointment
                              .treatment
                              .title
                          }
                        </p>

                        <p className="font-english mt-1 text-sm text-gray-500">
                          {
                            appointment.date
                          }{" "}
                          •{" "}
                          {
                            appointment.time
                          }
                        </p>

                        <p className="mt-1 text-xs uppercase text-gray-400">
                          {
                            appointment.status
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-400">
                    কোনো Appointment নেই।
                  </p>
                )}
              </div>
            </section>

            <section className="mt-8">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <Star
                  size={20}
                />

                Reviews
              </h3>

              <div className="mt-4 space-y-3">
                {selectedCustomer.reviews.length >
                0 ? (
                  selectedCustomer.reviews.map(
                    (review) => (
                      <div
                        key={
                          review.id
                        }
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <p className="font-semibold">
                          {
                            review.service
                          }{" "}
                          •{" "}
                          {
                            review.rating
                          }
                          /5
                        </p>

                        <p className="mt-2 text-sm leading-7 text-gray-500">
                          {
                            review.review
                          }
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-400">
                    কোনো Review নেই।
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;

  value:
    string | number;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}