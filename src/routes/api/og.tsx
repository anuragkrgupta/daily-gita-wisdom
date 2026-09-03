import { createAPIFileRoute } from "@tanstack/start/api";
import { ImageResponse } from "@vercel/og";
import { shloks } from "../../lib/shloks";

export const APIRoute = createAPIFileRoute("/api/og")({
  GET: async ({ request }) => {
    try {
      const url = new URL(request.url);
      const chapter = url.searchParams.get("chapter");
      const verse = url.searchParams.get("verse");

      if (!chapter || !verse) {
        return new Response("Missing chapter or verse", { status: 400 });
      }

      const shlok = shloks.find(
        (s) => s.chapter === Number(chapter) && s.verse === Number(verse)
      );

      if (!shlok) {
        return new Response("Shlok not found", { status: 404 });
      }

      // Fetch font to support Devanagari script
      const fontResponse = await fetch(
        "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf"
      );
      let fontData = null;
      if (fontResponse.ok) {
        fontData = await fontResponse.arrayBuffer();
      }

      // Generate the image using @vercel/og
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#111111",
              color: "#ffffff",
              padding: "40px",
              fontFamily: fontData ? '"Noto Sans Devanagari", sans-serif' : "sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255, 153, 0, 0.4)",
                borderRadius: "24px",
                padding: "60px",
                width: "100%",
                height: "100%",
                background: "linear-gradient(to bottom right, rgba(0,0,0,0.8), rgba(20,10,0,0.9))",
                boxShadow: "0 10px 40px rgba(255, 153, 0, 0.1)",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: "#ff9900",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginBottom: 40,
                }}
              >
                Bhagavad Gita {shlok.chapter}.{shlok.verse}
              </div>
              
              <div
                style={{
                  fontSize: 48,
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 1.4,
                  marginBottom: 40,
                  whiteSpace: "pre-wrap",
                }}
              >
                {shlok.sanskrit.split("\n")[0]}
                {"\n"}
                {shlok.sanskrit.split("\n")[1] || ""}
              </div>

              <div
                style={{
                  fontSize: 28,
                  textAlign: "center",
                  color: "#aaaaaa",
                  lineHeight: 1.4,
                  maxWidth: "90%",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {shlok.english}
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    color: "#ff9900",
                    fontSize: 24,
                  }}
                >
                  ॐ
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  DAILY GITA
                </div>
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: fontData ? [
            {
              name: 'Noto Sans Devanagari',
              data: fontData,
              style: 'normal',
              weight: 400,
            }
          ] : undefined,
          headers: {
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        }
      );
    } catch (e: any) {
      console.log(`${e.message}`);
      return new Response(`Failed to generate the image`, {
        status: 500,
      });
    }
  },
});
