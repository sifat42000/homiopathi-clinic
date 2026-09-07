import RegisterForm from "@/components/auth/RegisterForm";
import PublicLayout from "@/components/layout/PublicLayout";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <RegisterForm />
        </div>
      </section>
    </PublicLayout>
  );
}