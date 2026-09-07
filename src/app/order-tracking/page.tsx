import PublicLayout from "@/components/layout/PublicLayout";
import OrderTrackingForm from "@/components/tracking/OrderTrackingForm";
import PageHero from "@/components/ui/PageHero";

export default function OrderTrackingPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Track Order"
        title="আপনার Order-এর বর্তমান অবস্থা দেখুন"
        description="Order Number এবং Order করার সময় ব্যবহৃত Mobile Number দিয়ে Order Status খুঁজুন।"
        currentPage="Order Tracking"
      />

      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OrderTrackingForm />
        </div>
      </section>
    </PublicLayout>
  );
}