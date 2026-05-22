import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #5b21b6 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.12)",
              fontSize: "36px",
            }}
          >
            📄
          </div>
          <div style={{ fontSize: "28px", opacity: 0.85 }}>{siteConfig.shortName}</div>
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: "28px",
            fontSize: "30px",
            lineHeight: 1.4,
            opacity: 0.88,
            maxWidth: "920px",
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
