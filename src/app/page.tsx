import PublicLayout from "@/components/layout/PublicLayout";

import Hero from "@/components/home/Hero";
import DoctorSection from "@/components/home/DoctorSection";
import TreatmentsSection from "@/components/home/TreatmentsSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import HealthTipsSection from "@/components/home/HealthTipsSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTASection from "@/components/home/FinalCTASection";

export default function HomePage() {
  return (
    <PublicLayout>
      <Hero />

      <DoctorSection />

      <TreatmentsSection />

      <FeaturedProductsSection />

      <HowItWorksSection />

      <BenefitsSection />

      <ReviewsSection />

      <HealthTipsSection />

      <FAQSection />

      <FinalCTASection />
    </PublicLayout>
  );
}