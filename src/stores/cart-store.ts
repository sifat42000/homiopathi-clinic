import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/data/products";

export type CartItem = {
  id: number;
  name: string;
  englishName: string;
  slug: string;
  regularPrice: number;
  salePrice?: number;
  stock: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (
    product: Product,
    quantity?: number
  ) => void;

  removeItem: (productId: number) => void;

  increaseItem: (productId: number) => void;

  decreaseItem: (productId: number) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        product.stock
                      ),
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                englishName: product.englishName,
                slug: product.slug,
                regularPrice: product.regularPrice,
                salePrice: product.salePrice,
                stock: product.stock,
                quantity: Math.min(
                  quantity,
                  product.stock
                ),
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== productId
          ),
        })),

      increaseItem: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId &&
            item.quantity < item.stock
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        })),

      decreaseItem: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId &&
            item.quantity > 1
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          ),
        })),

      clearCart: () => {
        set({
          items: [],
        });
      },
    }),
    {
      name: "homeopathy-clinic-cart",
    }
  )
);