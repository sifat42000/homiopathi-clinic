import type {
  ObjectId,
} from "mongodb";

import {
  getDb,
} from "@/lib/mongodb";

import type {
  DatabaseProduct,
} from "@/types/product";

import type {
  ProductImage,
} from "@/types/product-image";

export type ProductDocument = {
  _id?: ObjectId;

  id: number;

  name: string;

  englishName: string;

  slug: string;

  shortDescription: string;

  description: string;

  regularPrice: number;

  salePrice?: number;

  discountEnabled?: boolean;

  discountPrice?: number;

  discountStartAt?: Date;

  discountEndAt?: Date;

  stock: number;

  badge?: string;

  category: string;

  categoryId: string;

  size: string;

  sku: string;

  usageInfo: string;

  images?: ProductImage[];

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export function serializeProduct(
  product: ProductDocument & {
    _id: ObjectId;
  }
): DatabaseProduct {
  return {
    databaseId:
      product._id.toString(),

    id:
      product.id,

    name:
      product.name,

    englishName:
      product.englishName,

    slug:
      product.slug,

    shortDescription:
      product.shortDescription,

    description:
      product.description,

    regularPrice:
      product.regularPrice,

    salePrice:
      product.salePrice,

    discountEnabled:
      product.discountEnabled ??
      false,

    discountPrice:
      product.discountPrice,

    discountStartAt:
      product.discountStartAt
        ?.toISOString(),

    discountEndAt:
      product.discountEndAt
        ?.toISOString(),

    stock:
      product.stock,

    badge:
      product.badge,

    category:
      product.category,

    categoryId:
      product.categoryId,

    size:
      product.size,

    sku:
      product.sku,

    usageInfo:
      product.usageInfo,

    images:
      product.images ?? [],

    active:
      product.active,

    createdAt:
      product.createdAt.toISOString(),

    updatedAt:
      product.updatedAt.toISOString(),
  };
}

export async function getPublicProducts() {
  const db =
    await getDb();

  const products =
    await db
      .collection<ProductDocument>(
        "products"
      )
      .find({
        active: true,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

  return products.map(
    (product) =>
      serializeProduct(
        product
      )
  );
}

export async function getProductBySlug(
  slug: string
) {
  const db =
    await getDb();

  const product =
    await db
      .collection<ProductDocument>(
        "products"
      )
      .findOne({
        slug,
        active: true,
      });

  if (!product) {
    return null;
  }

  return serializeProduct(
    product
  );
}

export async function getRelatedProducts(
  product: DatabaseProduct,
  limit = 3
) {
  const db =
    await getDb();

  const products =
    await db
      .collection<ProductDocument>(
        "products"
      )
      .find({
        active: true,

        categoryId:
          product.categoryId,

        slug: {
          $ne:
            product.slug,
        },
      })
      .limit(limit)
      .toArray();

  return products.map(
    (item) =>
      serializeProduct(
        item
      )
  );
}