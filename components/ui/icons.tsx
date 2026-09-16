import { cn } from "@/lib/utils";
import type { DiamondShape } from "@/constants/jewellery";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function BaseIcon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("block h-5 w-5", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </BaseIcon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </BaseIcon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </BaseIcon>
  );
}

export function HeartIcon(props: IconProps & { filled?: boolean }) {
  const { filled, className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("block h-5 w-5", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 01-8 0" />
    </BaseIcon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M6 9l6 6 6-6" />
    </BaseIcon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 18l6-6-6-6" />
    </BaseIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </BaseIcon>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </BaseIcon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </BaseIcon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </BaseIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M21 14.5A8.5 8.5 0 1110.5 3a7 7 0 0010.5 11.5z" />
    </BaseIcon>
  );
}

/** Simplified diamond shape silhouettes for filter UI */
export function DiamondShapeOutline({
  shape,
  className,
}: {
  shape: DiamondShape | "other";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="#C5A059"
      strokeWidth={1.15}
      strokeLinejoin="round"
      className={cn("h-12 w-12 text-[#C5A059]", className)}
      aria-hidden="true"
    >
      {shape === "round" && (
        <>
          <circle cx="24" cy="24" r="14.5" />
          <path d="M24 9.5v29M9.5 24h29" opacity="0.35" />
        </>
      )}
      {shape === "oval" && <ellipse cx="24" cy="24" rx="11" ry="16" />}
      {shape === "emerald" && (
        <path d="M16 8h16l8 8v16l-8 8H16l-8-8V16z" />
      )}
      {shape === "marquise" && (
        <path d="M24 6c6 8 10 12 10 18s-4 10-10 18C18 34 14 30 14 24s4-10 10-18z" />
      )}
      {shape === "radiant" && (
        <path d="M15 9h18l6 6v18l-6 6H15l-6-6V15z" />
      )}
      {shape === "pear" && (
        <path d="M24 7c7 8 10 14 10 20a10 10 0 01-20 0c0-6 3-12 10-20z" />
      )}
      {shape === "elongated-cushion" && (
        <rect x="14" y="7" width="20" height="34" rx="7" />
      )}
      {shape === "cushion" && (
        <rect x="10" y="10" width="28" height="28" rx="8" />
      )}
      {shape === "princess" && (
        <path d="M24 8l16 16-16 16L8 24z" />
      )}
      {shape === "asscher" && (
        <>
          <rect x="11" y="11" width="26" height="26" rx="1" />
          <path d="M17 17h14v14H17z" opacity="0.45" />
        </>
      )}
      {shape === "heart" && (
        <path d="M24 40s-14-9-14-20a8 8 0 0114-5 8 8 0 0114 5c0 11-14 20-14 20z" />
      )}
      {shape === "other" && <rect x="12" y="12" width="24" height="24" />}
    </svg>
  );
}

/** Simplified diamond shape silhouettes for filter UI */
export function DiamondShapeIcon({
  shape,
  className,
}: {
  shape: DiamondShape | "other";
  className?: string;
}) {
  const paths: Record<DiamondShape | "other", string> = {
    round: "M12 3l7 7-7 11L5 10z",
    oval: "M12 4c5 0 8 3.5 8 8s-3 8-8 8-8-3.5-8-8 3-8 8-8z",
    cushion: "M7 6h10l4 6-4 6H7l-4-6z",
    "elongated-cushion": "M8 4h8l5 8-5 8H8L3 12z",
    princess: "M12 3l8 8-8 10-8-10z",
    emerald: "M8 4h8l4 8-4 8H8l-4-8z",
    pear: "M12 3c4 4 6 8 6 12s-2.5 6-6 6S6 19 6 15s2-8 6-12z",
    marquise: "M12 4l9 8-9 8-9-8z",
    radiant: "M8 5h8l5 7-5 7H8l-5-7z",
    asscher: "M7 6h10v12H7z",
    heart: "M12 20s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z",
    other: "M6 6h12v12H6z",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("block h-5 w-5", className)}
      aria-hidden="true"
    >
      <path d={paths[shape]} opacity={0.85} />
    </svg>
  );
}
