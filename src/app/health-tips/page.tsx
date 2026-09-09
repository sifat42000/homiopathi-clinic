import PublicLayout from "@/components/layout/PublicLayout";

import HealthTipsExplorer from "@/components/health-tips/HealthTipsExplorer";

import {
  getPublicHealthTips,
} from "@/lib/db/health-tips";

export const dynamic =
  "force-dynamic";

export default async function HealthTipsPage() {
  const healthTips =
    await getPublicHealthTips();

  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#15803D]">
              Health Tips
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              স্বাস্থ্য বিষয়ক তথ্য ও সচেতনতা
            </h1>
          </div>

          <div className="mt-10">
            <HealthTipsExplorer
              healthTips={
                healthTips
              }
            />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}