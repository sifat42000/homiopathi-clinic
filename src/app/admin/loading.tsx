export default function AdminLoading() {
  return (
    <div className="space-y-5">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-gray-200" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-[22px] bg-white"
          />
        ))}
      </div>

      <div className="h-80 animate-pulse rounded-[24px] bg-white" />
    </div>
  );
}