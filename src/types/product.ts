import type {
  Product,
} from "@/data/products";

import type {
  ProductImage,
} from "@/types/product-image";

export type DatabaseProduct =
  Product & {
    databaseId: string;

    categoryId: string;

    images: ProductImage[];

    active: boolean;

    createdAt: string;

    updatedAt: string;
  }; 