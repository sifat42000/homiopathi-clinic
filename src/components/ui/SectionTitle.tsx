type SectionTitleProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionTitle({
  badge,
  title,
  description,
  align = "center",
}: SectionTitleProps) {
  const alignment =
    align === "left"
      ? "items-start text-left"
      : "items-center text-center";

  return (
    <div className={`flex flex-col ${alignment}`}>
      {badge && (
        <span className="mb-3 inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-[#166534]">
          {badge}
        </span>
      )}

      <h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#163020] sm:text-4xl lg:text-[42px]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}