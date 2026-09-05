import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — gold diamond on navy (test brand mark). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06182B",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.5 12.2 L16 7.2 L23.5 12.2 L16 25.2 Z"
            stroke="#D4AA45"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M8.5 12.2 H23.5" stroke="#D4AA45" strokeWidth="1.2" />
          <path
            d="M11.2 12.2 L16 7.2 L20.8 12.2"
            stroke="#D4AA45"
            strokeWidth="1.1"
            opacity="0.9"
          />
          <path
            d="M16 12.2 V25.2"
            stroke="#D4AA45"
            strokeWidth="1.1"
            opacity="0.75"
          />
          <path
            d="M11.2 12.2 L16 25.2 L20.8 12.2"
            stroke="#D4AA45"
            strokeWidth="1"
            opacity="0.55"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
