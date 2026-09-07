import type {
  Product,
} from "@/data/products";

export type DatabaseProduct =
  Product & {
    databaseId: string;

    categoryId: string;

    active: boolean;

    createdAt: string;

    updatedAt: string;
  };