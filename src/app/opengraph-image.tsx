import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "mailadmin panel — Domain, mailbox and policy management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Icon badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            borderRadius: "24px",
            background: "#f59e0b",
            marginBottom: "32px",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1c1917"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="m21 2-9.6 9.6" />
            <circle cx="19" cy="5" r="2" />
            <path d="m21 2-1.5 1.5" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#fafaf9",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          mailadmin panel
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 400,
            color: "#a8a29e",
            marginTop: "16px",
            letterSpacing: "0.04em",
          }}
        >
          Domains · Mailboxes · Aliases · Sender ACL
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
