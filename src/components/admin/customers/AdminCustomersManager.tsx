"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Power,
  Search,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";

import { useAdminOperationsStore } from "@/stores/admin-operations-store";

export default function AdminCustomersManager() {
  const customers =
    useAdminOperationsStore(
      (state) =>
        state.customers
    );

  const toggleCustomerStatus =
    useAdminOperationsStore(
      (state) =>
        state.toggleCustomerStatus
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

  const filteredCustomers =
    useMemo(() => {
      let result = [
        ...customers,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result = result.filter(
          (customer) =>
            customer.name
              .toLowerCase()
              .includes(query) ||
            customer.phone.includes(
              query
            ) ||
            customer.email
              ?.toLowerCase()
              .includes(query)
        );
      }

      if (
        statusFilter ===
        "active"
      ) {
        result =
          result.filter(
            (customer) =>
              customer.active
          );
      }

      if (
        statusFilter ===
        "blocked"
      ) {
        result =
          result.filter(
            (customer) =>
              !customer.active
          );
      }

      return result;
    }, [
      customers,
      search,
      statusFilter,
    ]);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Customers Loading...
      </div>
    );
  }

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.active
    ).length;

  const totalSpent =
    customers.reduce(
      (total, customer) =>
        total +
        customer.totalSpent,
      0
    );

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Customers
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Customer Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Customer Information এবং Account Status Manage করুন।
        </p>
      </div>

      {/* Stats */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <Users
            size={21}
            className="text-[#14532D]"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {customers.length}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Total Customers
          </p>
        </div>

        <div className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
          <UserCheck
            size={21}
            className="text-green-600"
          />

          <p className="font-english mt-4 text-3xl font-bold text-gray-900">
            {activeCustomers}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Active
          </p>
        </div>

        <div className="rounded-[22px] bg-[#14532D] p-5 text-white">
          <Users size={21} />

          <p className="mt-4 text-3xl font-bold">
            ৳{totalSpent}
          </p>

          <p className="mt-1 text-sm text-green-100/70">
            Customer Value
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-7 grid gap-3 rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_200px]">
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
            placeholder="Name, Phone অথবা Email..."
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
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none"
        >
          <option value="all">
            All Customers
          </option>

          <option value="active">
            Active
          </option>

          <option value="blocked">
            Blocked
          </option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F7FBF8]">
              <tr className="text-left text-xs font-semibold uppercase text-gray-500">
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
                  Spent
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(
                (customer) => (
                  <tr
                    key={
                      customer.id
                    }
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {
                          customer.name
                        }
                      </p>

                      <p className="font-english mt-1 text-xs text-gray-400">
                        {customer.email ??
                          "No Email"}
                      </p>
                    </td>

                    <td className="font-english px-5 py-4 text-sm">
                      {
                        customer.phone
                      }
                    </td>

                    <td className="font-english px-5 py-4 font-semibold">
                      {
                        customer.totalOrders
                      }
                    </td>

                    <td className="px-5 py-4 font-bold text-[#14532D]">
                      ৳
                      {
                        customer.totalSpent
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          customer.active
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {customer.active
                          ? "Active"
                          : "Blocked"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          toggleCustomerStatus(
                            customer.id
                          )
                        }
                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                          customer.active
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {customer.active ? (
                          <UserX size={15} />
                        ) : (
                          <Power size={15} />
                        )}

                        {customer.active
                          ? "Block"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}