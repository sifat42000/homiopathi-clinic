import HealthTipsExplorer from "@/components/health-tips/HealthTipsExplorer";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

export default function HealthTipsPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Health Tips"
        title="স্বাস্থ্য সচেতনতা ও সুস্থ জীবনযাপনের প্রয়োজনীয় তথ্য"
        description="দৈনন্দিন জীবন, স্বাস্থ্য সচেতনতা ও Lifestyle সম্পর্কিত সহজ ও পাঠযোগ্য তথ্য এখানে পাবেন।"
        currentPage="স্বাস্থ্য টিপস"
      />

      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HealthTipsExplorer />
        </div>
      </section>
    </PublicLayout>
  );
}