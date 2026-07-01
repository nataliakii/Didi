import { Container } from "@/components/ui/Container";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function DiamondsLoading() {
  return (
    <Container className="py-12 lg:py-16">
      <div className="max-w-2xl animate-pulse space-y-3">
        <div className="h-3 w-32 rounded bg-brand-cream" />
        <div className="h-10 w-72 rounded bg-brand-cream" />
        <div className="h-4 w-full rounded bg-brand-cream" />
      </div>
      <div className="mt-10">
        <SkeletonGrid count={6} />
      </div>
    </Container>
  );
}
