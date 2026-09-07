import LegalPageContent from "@/components/legal/LegalPageContent";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

import { medicalDisclaimerSections } from "@/data/legal";

export default function MedicalDisclaimerPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Important"
        title="Medical Disclaimer"
        description="Website-এর স্বাস্থ্যসংক্রান্ত তথ্য ব্যবহারের আগে এই গুরুত্বপূর্ণ নির্দেশনাগুলো জেনে নিন।"
        currentPage="Medical Disclaimer"
      />

      <LegalPageContent
        title="Medical Disclaimer"
        updatedDate="০৭ সেপ্টেম্বর ২০২৬"
        intro="এই Website কোনো ব্যক্তির জন্য স্বয়ংক্রিয় রোগ নির্ণয় বা নির্দিষ্ট চিকিৎসা সিদ্ধান্ত দেওয়ার উদ্দেশ্যে তৈরি নয়।"
        notice="জরুরি বা গুরুতর স্বাস্থ্য সমস্যায় Website-এর তথ্য, Product বা Online Appointment-এর ওপর নির্ভর না করে দ্রুত উপযুক্ত চিকিৎসা সেবা গ্রহণ করুন।"
        sections={medicalDisclaimerSections}
      />
    </PublicLayout>
  );
}