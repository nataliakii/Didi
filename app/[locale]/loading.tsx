import { Container } from "@/components/ui/Container";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function PageLoading() {
  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-2xl animate-pulse space-y-4 text-center">
        <div className="mx-auto h-3 w-40 rounded bg-brand-surface" />
        <div className="mx-auto h-12 w-72 rounded bg-brand-surface" />
        <div className="mx-auto h-4 w-full max-w-md rounded bg-brand-surface" />
      </div>
      <div className="mt-14">
        <SkeletonGrid count={8} />
      </div>
    </Container>
  );
}
