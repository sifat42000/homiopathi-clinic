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
import {
  createPageMetadata,
  siteUrl,
} from "@/lib/seo";

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
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createPageMetadata({
    title: product.name,
    description:
      product.shortDescription,
    path: `/products/${encodeURIComponent(product.slug)}`,
    keywords: [
      product.name,
      product.englishName,
      product.category,
      "হোমিওপ্যাথিক প্রোডাক্ট",
    ],
  });
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription,
            sku: product.sku,
            category: product.category,
            image: product.images
              .map((image) => image.url)
              .filter(Boolean),
            brand: {
              "@type": "Brand",
              name: "Homeopathy Clinic",
            },
            offers: {
              "@type": "Offer",
              url: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
              priceCurrency: "BDT",
              price: product.discountEnabled && product.discountPrice
                ? product.discountPrice
                : product.salePrice ?? product.regularPrice,
              availability: product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: "Homeopathy Clinic",
              },
            },
          }),
        }}
      />

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