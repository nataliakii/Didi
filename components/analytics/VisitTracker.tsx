"use client";

import { usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

const VISITOR_KEY = "asteria_vid";

function getOrCreateVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return "anonymous";
  }
}

/** Fire-and-forget page view beacon for super-admin analytics. */
export function VisitTracker() {
  const locale = useLocale();
  const pathname = usePathname();
  const lastKey = useRef<string>("");

  useEffect(() => {
    const key = `${locale}:${pathname}`;
    if (!pathname || lastKey.current === key) return;
    lastKey.current = key;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch("/api/analytics/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          path: pathname,
          visitorId: getOrCreateVisitorId(),
        }),
        signal: controller.signal,
        keepalive: true,
      }).catch(() => {
        /* ignore analytics network errors */
      });
    }, 200);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locale, pathname]);

  return null;
}
