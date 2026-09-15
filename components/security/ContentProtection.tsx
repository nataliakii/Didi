"use client";

import { CONTENT_PROTECTION_ENABLED } from "@/constants/site";
import { useEffect } from "react";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target.closest(
    "input, textarea, select, [contenteditable='true'], [contenteditable=''], [data-allow-copy]",
  );
  return Boolean(el);
}

function isProtectedMedia(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("img, picture, video, svg, canvas"));
}

/**
 * Soft storefront content protection:
 * blocks casual image save / drag and text copy.
 * Does not stop screenshots or DevTools — those cannot be reliably prevented.
 */
export function ContentProtection() {
  useEffect(() => {
    if (!CONTENT_PROTECTION_ENABLED) return;

    function onContextMenu(event: MouseEvent) {
      if (isEditableTarget(event.target)) return;
      // Block save-image / copy menus across the storefront.
      event.preventDefault();
    }

    function onDragStart(event: DragEvent) {
      if (isProtectedMedia(event.target)) {
        event.preventDefault();
      }
    }

    function onCopyOrCut(event: ClipboardEvent) {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      // Block copy / cut / save / select-all / view-source for casual scraping.
      if (["c", "x", "s", "a", "u"].includes(key)) {
        event.preventDefault();
      }
    }

    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("dragstart", onDragStart, true);
    document.addEventListener("copy", onCopyOrCut, true);
    document.addEventListener("cut", onCopyOrCut, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("dragstart", onDragStart, true);
      document.removeEventListener("copy", onCopyOrCut, true);
      document.removeEventListener("cut", onCopyOrCut, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
