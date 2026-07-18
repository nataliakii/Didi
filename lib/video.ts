export type ParsedVideo =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string };

export function parseVideoUrl(raw: string | undefined | null): ParsedVideo | null {
  const value = raw?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);

    if (
      url.hostname.includes("youtube.com") ||
      url.hostname.includes("youtu.be")
    ) {
      let id = "";
      if (url.hostname.includes("youtu.be")) {
        id = url.pathname.replace(/^\//, "");
      } else if (url.pathname.startsWith("/embed/")) {
        id = url.pathname.split("/")[2] ?? "";
      } else if (url.pathname.startsWith("/shorts/")) {
        id = url.pathname.split("/")[2] ?? "";
      } else {
        id = url.searchParams.get("v") ?? "";
      }
      if (!id) return null;
      return {
        kind: "youtube",
        embedUrl: `https://www.youtube.com/embed/${id}`,
      };
    }

    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (!id || !/^\d+$/.test(id)) return null;
      return {
        kind: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }

    if (/\.(mp4|webm|ogg)(\?|$)/i.test(url.pathname) || url.protocol === "https:") {
      return { kind: "file", src: value };
    }
  } catch {
    return null;
  }

  return { kind: "file", src: value };
}
