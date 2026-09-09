import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import SectionTitle from "@/components/ui/SectionTitle";

import {
  getPublicProducts,
} from "@/lib/db/products";

export default async function FeaturedProductsSection() {
  const products =
    await getPublicProducts();

  const featuredProducts =
    products.slice(0, 4);

  if (
    featuredProducts.length ===
    0
  ) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Products"
          title="নির্বাচিত প্রোডাক্ট"
          description="প্রয়োজনীয় Product Information এবং Price দেখুন।"
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map(
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

        <div className="mt-9 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-[#14532D] px-5 py-3 font-semibold text-[#14532D]"
          >
            সব Product দেখুন

            <ArrowRight
              size={17}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}