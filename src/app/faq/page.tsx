import FAQSection from "@/components/home/FAQSection";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

export default function FAQPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="FAQ"
        title="সাধারণ কিছু প্রশ্নের উত্তর"
        description="Appointment, Product Order, Account এবং চেম্বার সম্পর্কিত সাধারণ প্রশ্নগুলোর উত্তর এখানে পাবেন।"
        currentPage="সাধারণ প্রশ্ন"
      />

      <FAQSection />
    </PublicLayout>
  );
}