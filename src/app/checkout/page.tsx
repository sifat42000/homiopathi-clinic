import CheckoutClient from "@/components/checkout/CheckoutClient";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

export default function CheckoutPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Checkout"
        title="আপনার Order সম্পন্ন করুন"
        description="Delivery Information এবং Payment Method নির্বাচন করে আপনার Order Confirm করুন।"
        currentPage="Checkout"
      />

      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CheckoutClient />
        </div>
      </section>
    </PublicLayout>
  );
}