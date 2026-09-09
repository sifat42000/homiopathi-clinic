import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowRight,
  Home,
} from "lucide-react";

import { notFound } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import ProductDetails from "@/components/product/ProductDetails";
import PublicLayout from "@/components/layout/PublicLayout";

import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/db/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } =
    await params;

  const decodedSlug =
    decodeURIComponent(
      slug
    )
      .trim()
      .toLowerCase();

  const product =
    await getProductBySlug(
      decodedSlug
    );

  if (!product) {
    return {
      title:
        "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Homeopathy Clinic`,

    description:
      product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { slug } =
    await params;

  const decodedSlug =
    decodeURIComponent(
      slug
    )
      .trim()
      .toLowerCase();

  const product =
    await getProductBySlug(
      decodedSlug
    );

  if (!product) {
    console.log(
      "Product not found for slug:",
      decodedSlug
    );

    notFound();
  }

  const relatedProducts =
    await getRelatedProducts(
      product
    );

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <section className="border-b border-gray-100 bg-[#F7FBF8]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1 transition hover:text-[#14532D]"
            >
              <Home size={14} />

              হোম
            </Link>

            <ArrowRight
              size={13}
            />

            <Link
              href="/products"
              className="transition hover:text-[#14532D]"
            >
              প্রোডাক্ট
            </Link>

            <ArrowRight
              size={13}
            />

            <span className="text-[#14532D]">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      {/* Product */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductDetails
            product={
              product
            }
          />
        </div>
      </section>

      {/* Related */}
      {relatedProducts.length >
        0 && (
        <section className="bg-[#F7FBF8] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-[#15803D]">
                More Products
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Related Products
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map(
                (item) => (
                  <ProductCard
                    key={
                      item.databaseId
                    }
                    product={
                      item
                    }
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}