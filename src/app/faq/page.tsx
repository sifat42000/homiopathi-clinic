import FAQSection from "@/components/home/FAQSection";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";
import { faqs } from "@/data/faq";
import { siteUrl } from "@/lib/seo";

export default function FAQPage() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
            url: `${siteUrl}/faq`,
          }),
        }}
      />

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