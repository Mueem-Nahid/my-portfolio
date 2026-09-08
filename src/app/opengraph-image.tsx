import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content";

export const alt = "Mueem Nahid Ibn Mahbub — Senior Fullstack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const profile = getProfile();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0B1220",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: "#34D399",
          }}
        />
        <span style={{ color: "#8B96AB", fontSize: 24 }}>
          {profile.statusLine}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span
          style={{ color: "#E8ECF4", fontSize: 64, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          {profile.name}
        </span>
        <span style={{ color: "#8B96AB", fontSize: 32 }}>{profile.title}</span>
      </div>
      <span style={{ color: "#F2A65A", fontSize: 22 }}>{profile.location}</span>
    </div>,
    size,
  );
}
