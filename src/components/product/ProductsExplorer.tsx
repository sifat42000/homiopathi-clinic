"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  X,
} from "lucide-react";

import ProductCard from "@/components/product/ProductCard";

import type {
  Product,
} from "@/data/products";

type ProductsExplorerProps = {
  products: Product[];
};

export default function ProductsExplorer({
  products,
}: ProductsExplorerProps) {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [sort, setSort] =
    useState("default");

  const categories = [
    "All",

    ...Array.from(
      new Set(
        products.map(
          (product) =>
            product.category
        )
      )
    ),
  ];

  const filteredProducts =
    useMemo(() => {
      let result = [
        ...products,
      ];

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (product) =>
              product.name
                .toLowerCase()
                .includes(query) ||
              product.englishName
                .toLowerCase()
                .includes(query)
          );
      }

      if (
        category !== "All"
      ) {
        result =
          result.filter(
            (product) =>
              product.category ===
              category
          );
      }

      if (
        sort === "low-high"
      ) {
        result.sort(
          (a, b) =>
            (a.salePrice ??
              a.regularPrice) -
            (b.salePrice ??
              b.regularPrice)
        );
      }

      if (
        sort === "high-low"
      ) {
        result.sort(
          (a, b) =>
            (b.salePrice ??
              b.regularPrice) -
            (a.salePrice ??
              a.regularPrice)
        );
      }

      return result;
    }, [
      products,
      search,
      category,
      sort,
    ]);

  return (
    <div>
      <div className="grid gap-3 rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
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
            placeholder="Product Search করুন..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-10 outline-none focus:border-[#14532D]"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
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

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="default">
            Default
          </option>

          <option value="low-high">
            Price: Low to High
          </option>

          <option value="high-low">
            Price: High to Low
          </option>
        </select>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        মোট{" "}
        <strong className="text-[#14532D]">
          {
            filteredProducts.length
          }
        </strong>{" "}
        টি Product
      </p>

      {filteredProducts.length >
      0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={
                  product.id
                }
                product={
                  product
                }
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-dashed border-gray-200 bg-white py-16 text-center text-gray-400">
          কোনো Product পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}