export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6 p-6 lg:p-8">
      <div className="h-8 w-48 rounded bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 rounded-sm bg-stone-200" />
        ))}
      </div>
      <div className="h-64 rounded-sm bg-stone-200" />
    </div>
  );
}
