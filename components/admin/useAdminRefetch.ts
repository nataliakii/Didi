"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * After an admin mutation, navigate (optional) and force RSC refetch
 * so lists/detail stay in sync without a full browser reload.
 */
export function useAdminRefetch() {
  const router = useRouter();

  return useCallback(
    (href?: string) => {
      if (href) {
        router.push(href);
      }
      router.refresh();
    },
    [router],
  );
}
