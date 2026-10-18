// src/app/og/route.tsx
// The 1200×630 share card used as og:image / twitter:image on every page.
// /og?title=…&eyebrow=… — see ogImageUrl() in lib/seo.

import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/site";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "rsd.exe").slice(0, 120);
  const eyebrow = searchParams.get("eyebrow")?.slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FBF9F6",
          color: "#1F1F1F",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.6 }}>
          <span>rsd.exe</span>
          {eyebrow ? <span style={{ textTransform: "uppercase", letterSpacing: 4 }}>{eyebrow}</span> : null}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 64 : 84,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 }}>
          <span>Sudharshan R</span>
          <span style={{ color: "#5227FF" }}>{new URL(SITE_URL).host}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
