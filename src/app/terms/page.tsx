import LegalPageContent from "@/components/legal/LegalPageContent";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

import { termsSections } from "@/data/legal";

export default function TermsPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="Terms"
        title="Terms & Conditions"
        description="Website, Appointment এবং Product Order Service ব্যবহারের সাধারণ শর্তাবলি।"
        currentPage="Terms"
      />

      <LegalPageContent
        title="Terms & Conditions"
        updatedDate="০৭ সেপ্টেম্বর ২০২৬"
        intro="এই Website ব্যবহার করার মাধ্যমে ব্যবহারকারী Website-এর প্রযোজ্য নিয়ম ও Service Process মেনে চলতে সম্মত হন।"
        notice="এটি একটি সাধারণ Frontend Template। Launch-এর আগে আপনার ব্যবসার বাস্তব Order, Return, Refund, Delivery ও Appointment Policy অনুযায়ী এটি Update করতে হবে।"
        sections={termsSections}
      />
    </PublicLayout>
  );
}