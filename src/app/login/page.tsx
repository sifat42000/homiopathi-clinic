import LoginForm from "@/components/auth/LoginForm";
import PublicLayout from "@/components/layout/PublicLayout";

export default function LoginPage() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-lg px-4 sm:px-6">
          <LoginForm />
        </div>
      </section>
    </PublicLayout>
  );
}