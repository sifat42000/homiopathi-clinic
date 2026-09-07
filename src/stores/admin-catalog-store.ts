import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  allProducts,
  type Product,
} from "@/data/products";

export type AdminProduct = Product & {
  active: boolean;
  createdAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  active: boolean;
};

type ProductWithoutId = Omit<
  Product,
  "id"
>;

type AdminCatalogStore = {
  products: AdminProduct[];
  categories: AdminCategory[];

  addProduct: (
    product: ProductWithoutId
  ) => void;

  updateProduct: (
    id: number,
    product: ProductWithoutId
  ) => void;

  deleteProduct: (
    id: number
  ) => void;

  toggleProductStatus: (
    id: number
  ) => void;

  addCategory: (
    name: string
  ) => boolean;

  deleteCategory: (
    id: string
  ) => boolean;

  toggleCategoryStatus: (
    id: string
  ) => void;
};

const initialProducts: AdminProduct[] =
  allProducts.map((product) => ({
    ...product,
    active: true,
    createdAt:
      "2026-09-07T00:00:00.000Z",
  }));

const initialCategories: AdminCategory[] =
  Array.from(
    new Set(
      allProducts.map(
        (product) => product.category
      )
    )
  ).map((name, index) => ({
    id: `category-${index + 1}`,
    name,
    active: true,
  }));

export const useAdminCatalogStore =
  create<AdminCatalogStore>()(
    persist(
      (set, get) => ({
        products:
          initialProducts,

        categories:
          initialCategories,

        addProduct: (product) =>
          set((state) => {
            const nextId =
              state.products.length > 0
                ? Math.max(
                    ...state.products.map(
                      (item) => item.id
                    )
                  ) + 1
                : 1;

            return {
              products: [
                ...state.products,
                {
                  ...product,
                  id: nextId,
                  active: true,
                  createdAt:
                    new Date().toISOString(),
                },
              ],
            };
          }),

        updateProduct: (
          id,
          product
        ) =>
          set((state) => ({
            products:
              state.products.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        ...product,
                      }
                    : item
              ),
          })),

        deleteProduct: (id) =>
          set((state) => ({
            products:
              state.products.filter(
                (item) =>
                  item.id !== id
              ),
          })),

        toggleProductStatus: (
          id
        ) =>
          set((state) => ({
            products:
              state.products.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        active:
                          !item.active,
                      }
                    : item
              ),
          })),

        addCategory: (name) => {
          const cleanName =
            name.trim();

          if (!cleanName) {
            return false;
          }

          const alreadyExists =
            get().categories.some(
              (category) =>
                category.name.toLowerCase() ===
                cleanName.toLowerCase()
            );

          if (alreadyExists) {
            return false;
          }

          set((state) => ({
            categories: [
              ...state.categories,
              {
                id: `category-${Date.now()}`,
                name: cleanName,
                active: true,
              },
            ],
          }));

          return true;
        },

        deleteCategory: (id) => {
          const category =
            get().categories.find(
              (item) =>
                item.id === id
            );

          if (!category) {
            return false;
          }

          const categoryUsed =
            get().products.some(
              (product) =>
                product.category ===
                category.name
            );

          if (categoryUsed) {
            return false;
          }

          set((state) => ({
            categories:
              state.categories.filter(
                (item) =>
                  item.id !== id
              ),
          }));

          return true;
        },

        toggleCategoryStatus: (
          id
        ) =>
          set((state) => ({
            categories:
              state.categories.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        active:
                          !item.active,
                      }
                    : item
              ),
          })),
      }),
      {
        name:
          "homeopathy-admin-catalog",
      }
    )
  );