import OrderSuccessClient from "@/components/order/OrderSuccessClient";
import PublicLayout from "@/components/layout/PublicLayout";

export default function OrderSuccessPage() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OrderSuccessClient />
        </div>
      </section>
    </PublicLayout>
  );
}