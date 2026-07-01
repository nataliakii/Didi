import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-square rounded-sm bg-stone-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-stone-200" />
        <div className="h-4 w-2/3 rounded bg-stone-200" />
        <div className="h-4 w-1/4 rounded bg-stone-200" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
