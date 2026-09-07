import AccountDashboard from "@/components/account/AccountDashboard";
import AccountLayout from "@/components/account/AccountLayout";
import PublicLayout from "@/components/layout/PublicLayout";

export default function AccountPage() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountLayout>
            <AccountDashboard />
          </AccountLayout>
        </div>
      </section>
    </PublicLayout>
  );
}