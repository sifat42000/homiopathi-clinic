import PublicLayout from "@/components/layout/PublicLayout";
import ProductsExplorer from "@/components/product/ProductsExplorer";
import PageHero from "@/components/ui/PageHero";

import {
  getPublicProducts,
} from "@/lib/db/products";

export const dynamic =
  "force-dynamic";

export default async function ProductsPage() {
  const products =
    await getPublicProducts();

  return (
    <PublicLayout>
      <PageHero
        badge="Products"
        title="প্রয়োজনীয় নির্বাচিত প্রোডাক্ট"
        description="Product Information, Price এবং Stock দেখে প্রয়োজন অনুযায়ী Product নির্বাচন করুন।"
        currentPage="প্রোডাক্ট"
      />

      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductsExplorer
            products={
              products
            }
          />
        </div>
      </section>
    </PublicLayout>
  );
}