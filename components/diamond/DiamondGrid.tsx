import { EmptyState } from "@/components/ui/EmptyState";
import { DiamondCard } from "@/components/diamond/DiamondCard";
import type { DiamondSummary } from "@/types";

interface DiamondGridProps {
  diamonds: DiamondSummary[];
}

export function DiamondGrid({ diamonds }: DiamondGridProps) {
  if (diamonds.length === 0) {
    return (
      <EmptyState
        title="No diamonds found"
        description="Try adjusting your filters to discover more certified diamonds."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-6 lg:grid-cols-3">
      {diamonds.map((diamond) => (
        <DiamondCard key={diamond._id} diamond={diamond} />
      ))}
    </div>
  );
}
