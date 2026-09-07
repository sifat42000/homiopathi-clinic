import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { featuredProducts } from "@/data/products";

export default function FeaturedProductsSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <SectionTitle
          badge="নির্বাচিত প্রোডাক্ট"
          title="আপনার প্রয়োজনের জন্য জনপ্রিয় কিছু প্রোডাক্ট"
          description="প্রোডাক্ট সম্পর্কে প্রয়োজনীয় তথ্য দেখে সহজেই আপনার প্রয়োজন অনুযায়ী পণ্য নির্বাচন করতে পারবেন।"
        />

        {/* Products */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-7 py-3.5 font-semibold text-white transition hover:bg-[#166534]"
          >
            সব প্রোডাক্ট দেখুন

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}