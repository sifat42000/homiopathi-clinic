import {
  Info,
} from "lucide-react";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageContentProps = {
  title: string;
  updatedDate: string;
  intro: string;
  sections: LegalSection[];
  notice?: string;
};

export default function LegalPageContent({
  title,
  updatedDate,
  intro,
  sections,
  notice,
}: LegalPageContentProps) {
  return (
    <section className="bg-[#F7FBF8] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <article className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          
          {/* Heading */}
          <div className="border-b border-gray-100 pb-7">
            <p className="text-sm text-gray-400">
              সর্বশেষ আপডেট: {updatedDate}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {title}
            </h1>

            <p className="mt-5 text-base leading-8 text-gray-600">
              {intro}
            </p>
          </div>

          {/* Notice */}
          {notice && (
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <p className="text-sm leading-7 text-amber-900">
                {notice}
              </p>
            </div>
          )}

          {/* Sections */}
          <div className="mt-8 space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {section.title}
                </h2>

                <div className="mt-3 space-y-3">
                  {section.paragraphs.map(
                    (paragraph, index) => (
                      <p
                        key={`${section.title}-${index}`}
                        className="text-sm leading-8 text-gray-600 sm:text-base"
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}