import type {
  LucideIcon,
} from "lucide-react";

type AccountEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function AccountEmptyState({
  icon: Icon,
  title,
  description,
}: AccountEmptyStateProps) {
  return (
    <div className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {title}
      </h1>

      <div className="mt-8 rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
        <Icon
          size={38}
          className="mx-auto text-gray-300"
        />

        <p className="mt-4 text-sm leading-7 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}