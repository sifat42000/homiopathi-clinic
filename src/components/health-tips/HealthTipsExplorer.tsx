"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
} from "lucide-react";

import HealthTipCard from "@/components/health-tips/HealthTipCard";

import { healthTips } from "@/data/healthTips";

export default function HealthTipsExplorer() {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("সব");

  const categories = [
    "সব",
    ...Array.from(
      new Set(
        healthTips.map(
          (tip) => tip.category
        )
      )
    ),
  ];

  const filteredTips =
    useMemo(() => {
      let tips = [...healthTips];

      if (search.trim()) {
        const query =
          search
            .trim()
            .toLowerCase();

        tips = tips.filter(
          (tip) =>
            tip.title
              .toLowerCase()
              .includes(query) ||
            tip.excerpt
              .toLowerCase()
              .includes(query) ||
            tip.category
              .toLowerCase()
              .includes(query)
        );
      }

      if (category !== "সব") {
        tips = tips.filter(
          (tip) =>
            tip.category ===
            category
        );
      }

      return tips;
    }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("সব");
  };

  return (
    <div>
      {/* Search */}
      <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search
            size={19}
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
            placeholder="স্বাস্থ্য টিপস খুঁজুন..."
            className="w-full rounded-xl border border-gray-200 bg-[#FAFAF7] py-3 pl-11 pr-10 outline-none placeholder:text-gray-400 focus:border-[#14532D]"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-[#14532D] text-white"
                    : "bg-green-50 text-[#166534] hover:bg-green-100"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {/* Count */}
      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          মোট{" "}
          <span className="font-bold text-[#14532D]">
            {filteredTips.length}
          </span>{" "}
          টি লেখা পাওয়া গেছে
        </p>

        {(search ||
          category !== "সব") && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#14532D]"
          >
            <X size={16} />

            Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredTips.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTips.map(
            (tip) => (
              <HealthTipCard
                key={tip.id}
                tip={tip}
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-dashed border-gray-200 bg-white py-16 text-center">
          <Search
            size={38}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            কোনো লেখা পাওয়া যায়নি
          </h3>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
          >
            সব লেখা দেখুন
          </button>
        </div>
      )}
    </div>
  );
}