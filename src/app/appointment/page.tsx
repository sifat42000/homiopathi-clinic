import AppointmentBooking from "@/components/appointment/AppointmentBooking";
import PublicLayout from "@/components/layout/PublicLayout";
import PageHero from "@/components/ui/PageHero";

type AppointmentPageProps = {
  searchParams: Promise<{
    treatment?: string;
  }>;
};

export default async function AppointmentPage({
  searchParams,
}: AppointmentPageProps) {
  const { treatment } =
    await searchParams;

  return (
    <PublicLayout>
      <PageHero
        badge="Appointment"
        title="আপনার সুবিধামতো Appointment বুক করুন"
        description="Consultation Service, Date এবং Available Time নির্বাচন করে কয়েকটি সহজ ধাপে Appointment Request সম্পন্ন করুন।"
        currentPage="Appointment"
      />

      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AppointmentBooking
            initialTreatmentSlug={
              treatment
            }
          />
        </div>
      </section>
    </PublicLayout>
  );
}