"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Search,
} from "lucide-react";

import HealthTipCard from "@/components/health-tips/HealthTipCard";

import type {
  DatabaseHealthTip,
} from "@/types/health-tip";

type Props = {
  healthTips:
    DatabaseHealthTip[];
};

export default function HealthTipsExplorer({
  healthTips,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const categories = [
    "All",

    ...Array.from(
      new Set(
        healthTips.map(
          (tip) =>
            tip.category
        )
      )
    ),
  ];

  const filtered =
    useMemo(() => {
      let result = [
        ...healthTips,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (tip) =>
              tip.title
                .toLowerCase()
                .includes(
                  query
                ) ||
              tip.excerpt
                .toLowerCase()
                .includes(
                  query
                )
          );
      }

      if (
        category !== "All"
      ) {
        result =
          result.filter(
            (tip) =>
              tip.category ===
              category
          );
      }

      return result;
    }, [
      healthTips,
      search,
      category,
    ]);

  return (
    <div>
      <div className="grid gap-3 rounded-[22px] border bg-white p-4 md:grid-cols-[1fr_220px]">
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
            placeholder="Health Tip Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4"
          />
        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      {filtered.length >
      0 ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(
            (tip) => (
              <HealthTipCard
                key={
                  tip.databaseId
                }
                tip={tip}
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-7 rounded-[24px] border border-dashed py-14 text-center text-gray-400">
          কোনো Article পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}