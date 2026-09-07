import LegalPageContent from "@/components/legal/LegalPageContent";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

import { privacyPolicySections } from "@/data/legal";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Privacy"
        title="Privacy Policy"
        description="আপনার ব্যক্তিগত তথ্য কীভাবে ব্যবহার ও পরিচালনা করা হবে তার সাধারণ নীতিমালা।"
        currentPage="Privacy Policy"
      />

      <LegalPageContent
        title="Privacy Policy"
        updatedDate="০৭ সেপ্টেম্বর ২০২৬"
        intro="Website ব্যবহারকারীর ব্যক্তিগত তথ্যকে দায়িত্বশীলভাবে পরিচালনা করা আমাদের জন্য গুরুত্বপূর্ণ। নিচে তথ্য সংগ্রহ ও ব্যবহারের সাধারণ কাঠামো তুলে ধরা হয়েছে।"
        notice="এটি Frontend পর্যায়ের একটি Policy Template। Website Launch-এর আগে ব্যবসার প্রকৃত Data Practice অনুযায়ী Policy Update ও প্রয়োজন হলে Legal Review করা উচিত।"
        sections={privacyPolicySections}
      />
    </PublicLayout>
  );
}