import AccountLayout from "@/components/account/AccountLayout";
import CustomerDashboardOverview from "@/components/account/CustomerDashboardOverview";
import PublicLayout from "@/components/layout/PublicLayout";

export default function AccountDashboardPage() {
  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-180px)] bg-[#F7FBF8] py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountLayout>
            <CustomerDashboardOverview />
          </AccountLayout>
        </div>
      </section>
    </PublicLayout>
  );
}