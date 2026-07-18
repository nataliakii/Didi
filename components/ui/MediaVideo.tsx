import { parseVideoUrl } from "@/lib/video";

export function MediaVideo({
  url,
  title = "Product video",
  className,
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.kind === "file") {
    return (
      <video
        className={className ?? "h-full w-full object-cover"}
        src={parsed.src}
        controls
        playsInline
        preload="metadata"
      >
        <track kind="captions" />
      </video>
    );
  }

  return (
    <iframe
      src={parsed.embedUrl}
      title={title}
      className={className ?? "h-full w-full"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
