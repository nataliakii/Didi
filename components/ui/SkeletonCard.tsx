import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-square rounded-sm bg-brand-surface" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-brand-surface" />
        <div className="h-4 w-2/3 rounded bg-brand-surface" />
        <div className="h-4 w-1/4 rounded bg-brand-surface" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
