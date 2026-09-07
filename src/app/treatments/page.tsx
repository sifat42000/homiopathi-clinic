import PublicLayout from "@/components/layout/PublicLayout";
import TreatmentCard from "@/components/treatment/TreatmentCard";
import PageHero from "@/components/ui/PageHero";

import { treatments } from "@/data/treatments";

export default function TreatmentsPage() {
  return (
    <PublicLayout>
      <PageHero
        badge="চিকিৎসা ও পরামর্শ"
        title="আপনার প্রয়োজন অনুযায়ী Consultation Service নির্বাচন করুন"
        description="প্রতিটি সেবা সম্পর্কে প্রয়োজনীয় তথ্য দেখে আপনার জন্য উপযুক্ত Consultation নির্বাচন করুন এবং সহজেই Appointment বুক করুন।"
        currentPage="চিকিৎসা"
      />

      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Info */}
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#15803D]">
                Available Services
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                বর্তমানে {treatments.length}টি Consultation Service রয়েছে
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-500">
              Consultation Fee এবং সময় এখন Demo হিসেবে রাখা হয়েছে। পরে
              ডাক্তারের প্রকৃত তথ্য অনুযায়ী পরিবর্তন করা যাবে।
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {treatments.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
              />
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}