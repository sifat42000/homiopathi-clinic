import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Home,
} from "lucide-react";

import PublicLayout from "@/components/layout/PublicLayout";
import ProductCard from "@/components/product/ProductCard";
import ProductDetails from "@/components/product/ProductDetails";
import SectionTitle from "@/components/ui/SectionTitle";
import { allProducts } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = allProducts.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Homeopathy Clinic`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = allProducts.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  let relatedProducts = allProducts
    .filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category
    )
    .slice(0, 3);

  if (relatedProducts.length < 3) {
    const additionalProducts = allProducts
      .filter(
        (item) =>
          item.id !== product.id &&
          !relatedProducts.some(
            (related) => related.id === item.id
          )
      )
      .slice(0, 3 - relatedProducts.length);

    relatedProducts = [
      ...relatedProducts,
      ...additionalProducts,
    ];
  }

  return (
    <PublicLayout>
      
      {/* Breadcrumb */}
      <section className="border-b border-gray-100 bg-[#F7FBF8]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1.5 transition hover:text-[#14532D]"
            >
              <Home size={14} />
              হোম
            </Link>

            <ArrowRight size={13} />

            <Link
              href="/products"
              className="transition hover:text-[#14532D]"
            >
              প্রোডাক্ট
            </Link>

            <ArrowRight size={13} />

            <span className="font-medium text-[#14532D]">
              {product.name}
            </span>
          </div>
        </div>
      </section>

      {/* Product */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductDetails product={product} />
        </div>
      </section>

      {/* Description */}
      <section className="bg-[#F7FBF8] py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              প্রোডাক্ট সম্পর্কে
            </h2>

            <p className="mt-4 text-base leading-8 text-gray-600">
              {product.description}
            </p>

            <div className="mt-8 border-t border-gray-100 pt-7">
              <h3 className="text-xl font-bold text-gray-900">
                ব্যবহারের তথ্য
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {product.usageInfo}
              </p>
            </div>

            <div className="mt-7 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
              <p className="text-sm leading-7 text-amber-900">
                স্বাস্থ্যসংক্রান্ত কোনো Product ব্যবহারের ক্ষেত্রে ব্যক্তির
                অবস্থা ও প্রয়োজন ভিন্ন হতে পারে। প্রয়োজনে উপযুক্ত চিকিৎসা
                পরামর্শ নিন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="আরও প্রোডাক্ট"
            title="আপনার জন্য আরও কিছু প্রোডাক্ট"
            description="অন্যান্য প্রোডাক্টের প্রয়োজনীয় তথ্যও দেখে নিতে পারেন।"
          />

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}