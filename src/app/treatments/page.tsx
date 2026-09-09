import PublicLayout from "@/components/layout/PublicLayout";

import DatabaseTreatmentCard from "@/components/treatment/DatabaseTreatmentCard";

import {
  getPublicTreatments,
} from "@/lib/db/treatments";

export const dynamic =
  "force-dynamic";

export default async function TreatmentsPage() {
  const treatments =
    await getPublicTreatments();

  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-[#15803D]">
              Treatments
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Consultation Services
            </h1>

            <p className="mt-4 leading-8 text-gray-500">
              উপলব্ধ Consultation Service, Fee এবং Duration দেখুন।
            </p>
          </div>

          {treatments.length >
          0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {treatments.map(
                (treatment) => (
                  <DatabaseTreatmentCard
                    key={
                      treatment.databaseId
                    }
                    treatment={
                      treatment
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-gray-200 bg-white py-16 text-center text-gray-400">
              বর্তমানে কোনো Treatment প্রকাশ করা হয়নি।
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}