// components/icons/PixelIcons.tsx
"use client";

export const PixelHome = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 22 22" width={size} height={size}>
    <path
      d="M11 2L3 8v10h6v-5h4v5h6V8z"
      fill="none"
      stroke="black"
      strokeWidth="1.5"
    />
  </svg>
);

export const PixelLog = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 22 22" width={size} height={size}>
    <rect x="5" y="4" width="12" height="14" fill="none" stroke="black" strokeWidth="1.5" />
    <line x1="7" y1="7" x2="15" y2="7" stroke="black" strokeWidth="1" />
    <line x1="7" y1="10" x2="15" y2="10" stroke="black" strokeWidth="1" />
    <line x1="7" y1="13" x2="15" y2="13" stroke="black" strokeWidth="1" />
  </svg>
);

export const PixelBooks = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 22 22" width={size} height={size}>
    <rect x="5" y="4" width="5" height="14" fill="none" stroke="black" strokeWidth="1.5" />
    <rect x="12" y="4" width="5" height="14" fill="none" stroke="black" strokeWidth="1.5" />
    <line x1="10" y1="4" x2="12" y2="4" stroke="black" strokeWidth="1.5" />
  </svg>
);

export const PixelCal = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 22 22" width={size} height={size}>
    <rect x="4" y="6" width="14" height="12" fill="none" stroke="black" strokeWidth="1.5" />
    <line x1="4" y1="9" x2="18" y2="9" stroke="black" strokeWidth="1" />
    <line x1="7" y1="4" x2="7" y2="8" stroke="black" strokeWidth="1.5" />
    <line x1="15" y1="4" x2="15" y2="8" stroke="black" strokeWidth="1.5" />
  </svg>
);
