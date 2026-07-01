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
      className={cn("h-5 w-5", className)}
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
      className={cn("h-5 w-5", className)}
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
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      <path d={paths[shape]} opacity={0.85} />
    </svg>
  );
}
