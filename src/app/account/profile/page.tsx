import {
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import AccountLayout from "@/components/account/AccountLayout";
import PublicLayout from "@/components/layout/PublicLayout";

export default function ProfilePage() {
  return (
    <PublicLayout>
      <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccountLayout>
            <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Profile
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Backend Phase-এ Customer নিজের Profile Information Update
                করতে পারবেন।
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                
                <div className="rounded-2xl bg-[#F7FBF8] p-5">
                  <UserRound
                    size={20}
                    className="text-[#14532D]"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    Demo Customer
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FBF8] p-5">
                  <Mail
                    size={20}
                    className="text-[#14532D]"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Email
                  </p>

                  <p className="font-english mt-1 text-sm font-semibold text-gray-800">
                    customer@example.com
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FBF8] p-5">
                  <Phone
                    size={20}
                    className="text-[#14532D]"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Backend-এর পর দেখাবে
                  </p>
                </div>
              </div>
            </div>
          </AccountLayout>
        </div>
      </section>
    </PublicLayout>
  );
}