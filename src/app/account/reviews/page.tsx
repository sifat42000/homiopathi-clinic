import { MessageSquareText } from "lucide-react";

import AccountEmptyState from "@/components/account/AccountEmptyState";
import AccountLayout from "@/components/account/AccountLayout";
import PublicLayout from "@/components/layout/PublicLayout";

export default function MyReviewsPage() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountLayout>
            <AccountEmptyState
              icon={MessageSquareText}
              title="My Reviews"
              description="Customer যে Review Submit করেছেন এবং Review Status এখানে দেখা যাবে।"
            />
          </AccountLayout>
        </div>
      </section>
    </PublicLayout>
  );
}