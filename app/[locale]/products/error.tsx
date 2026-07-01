"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <Container className="py-16">
      <EmptyState
        title="Something went wrong"
        description="We couldn't load the product catalogue. Please try again."
        action={
          <Button onClick={reset}>Try again</Button>
        }
      />
    </Container>
  );
}
