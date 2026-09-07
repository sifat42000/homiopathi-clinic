import CartPageClient from "@/components/cart/CartPageClient";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

export default function CartPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Shopping Cart"
        title="আপনার নির্বাচিত প্রোডাক্টগুলো দেখুন"
        description="Product Quantity পরিবর্তন করুন, প্রয়োজন না হলে Product সরিয়ে দিন এবং Order-এর পরবর্তী ধাপে এগিয়ে যান।"
        currentPage="Cart"
      />

      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CartPageClient />
        </div>
      </section>
    </PublicLayout>
  );
}