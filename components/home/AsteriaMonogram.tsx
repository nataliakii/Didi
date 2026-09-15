export function AsteriaMonogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient
          id="asteria-gold"
          x1="36"
          y1="12"
          x2="164"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f0d9a0" />
          <stop offset="45%" stopColor="#d2b36c" />
          <stop offset="100%" stopColor="#b8944a" />
        </linearGradient>
        <linearGradient
          id="asteria-gold-ray"
          x1="100"
          y1="16"
          x2="100"
          y2="184"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f4e2b4" />
          <stop offset="55%" stopColor="#d2b36c" />
          <stop offset="100%" stopColor="#c4a25c" />
        </linearGradient>
        <radialGradient id="asteria-diamond" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f7f1ea" />
          <stop offset="100%" stopColor="#d2b36c" />
        </radialGradient>
      </defs>

      {/* Open A — two legs, star sits in the void */}
      <path d="M100 14 L112 14 L64 188 H44 Z" fill="url(#asteria-gold)" />
      <path d="M100 14 L88 14 L136 188 H156 Z" fill="url(#asteria-gold)" />

      {/* Long compass rays */}
      <path d="M100 16 L107 86 L100 94 L93 86 Z" fill="url(#asteria-gold-ray)" />
      <path d="M100 184 L107 114 L100 106 L93 114 Z" fill="url(#asteria-gold-ray)" />
      <path d="M32 100 L93 93 L100 100 L93 107 Z" fill="url(#asteria-gold-ray)" />
      <path d="M168 100 L107 93 L100 100 L107 107 Z" fill="url(#asteria-gold-ray)" />

      {/* Diagonal rays */}
      <path
        d="M50 50 L91 91 L100 86 L109 91 Z"
        fill="url(#asteria-gold-ray)"
        opacity="0.92"
      />
      <path
        d="M150 50 L109 91 L100 86 L91 91 Z"
        fill="url(#asteria-gold-ray)"
        opacity="0.92"
      />
      <path
        d="M50 150 L91 109 L100 114 L109 109 Z"
        fill="url(#asteria-gold-ray)"
        opacity="0.92"
      />
      <path
        d="M150 150 L109 109 L100 114 L91 109 Z"
        fill="url(#asteria-gold-ray)"
        opacity="0.92"
      />

      <path
        d="M100 84 L112 100 L100 116 L88 100 Z"
        fill="url(#asteria-diamond)"
        stroke="#d2b36c"
        strokeWidth="0.7"
      />
      <path d="M100 84 L112 100 L100 100 Z" fill="#ffffff" opacity="0.5" />
      <path d="M100 84 L88 100 L100 100 Z" fill="#d2b36c" opacity="0.22" />
    </svg>
  );
}
