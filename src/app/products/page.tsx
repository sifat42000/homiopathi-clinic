import PublicLayout from "@/components/layout/PublicLayout";
import ProductsExplorer from "@/components/product/ProductsExplorer";
import PageHero from "@/components/ui/PageHero";

export default function ProductsPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="আমাদের প্রোডাক্ট"
        title="আপনার প্রয়োজন অনুযায়ী প্রোডাক্ট খুঁজুন"
        description="Category, Product Name এবং প্রয়োজনীয় তথ্য দেখে সহজেই আপনার প্রয়োজনের পণ্য নির্বাচন করুন।"
        currentPage="প্রোডাক্ট"
      />

      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductsExplorer />
        </div>
      </section>
    </PublicLayout>
  );
}