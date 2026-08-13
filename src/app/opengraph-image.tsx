import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AnimeX - AI-Powered Anime Recommendations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #111111, #D32F2F)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <h1 style={{ fontSize: 100, fontWeight: "bold", margin: 0, letterSpacing: "-0.05em" }}>
            AnimeX
          </h1>
          <p style={{ fontSize: 40, opacity: 0.8, margin: 0 }}>
            Discover Your Next Favorite Anime
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
