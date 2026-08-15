import { Container } from "@/components/ui/Container";

export default function AboutLoading() {
  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-2xl animate-pulse space-y-4">
        <div className="h-3 w-32 rounded bg-brand-surface" />
        <div className="h-10 w-48 rounded bg-brand-surface" />
        <div className="mt-10 space-y-3 border-t border-brand-gold/15 pt-10">
          <div className="h-7 w-56 rounded bg-brand-surface" />
          <div className="h-3 w-40 rounded bg-brand-surface" />
          <div className="h-20 w-full rounded bg-brand-surface" />
        </div>
      </div>
    </Container>
  );
}
