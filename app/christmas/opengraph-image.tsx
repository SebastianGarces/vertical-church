import { ImageResponse } from "next/og";

export const alt = "Join us for Christmas at Vertical Church. Christmas Eve at 4PM, 5400 Lear Nagle Rd.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function loadFont(url: string, name: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to load the ${name} font.`);
  }
  return response.arrayBuffer();
}

export default async function OpenGraphImage() {
  const [italic, bold, overpassBold] = await Promise.all([
    // Tinos is metric-compatible with Times New Roman (the page's display stack), and
    // Satori can't use system fonts. The page's script face (Jimmy Script) is only
    // shipped as woff2, which Satori can't read, so the OG card uses Tinos italic.
    loadFont("https://fonts.gstatic.com/s/tinos/v26/buE2poGnedXvwjX-fmE.ttf", "Tinos Italic"),
    loadFont("https://fonts.gstatic.com/s/tinos/v26/buE1poGnedXvwj1AW0Fp.ttf", "Tinos Bold"),
    loadFont("https://fonts.gstatic.com/s/overpass/v19/qFda35WCmI96Ajtm83upeyoaX6QPnlo6G_TrOQ.ttf", "Overpass"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#2D412F",
          color: "#EAECEA",
          display: "flex",
          gap: 56,
          height: "100%",
          padding: "0 72px",
          width: "100%",
        }}
      >
        <img
          alt="Lit candles on a wooden table, ringed with pine and red berries"
          src="https://vertical-church.t3.storage.dev/vertical-candles.jpg"
          width={340}
          height={510}
          style={{ borderRadius: 28, height: 510, objectFit: "cover", width: 340 }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Tinos", fontSize: 52, fontStyle: "italic", lineHeight: 1 }}>
            Join us for
          </div>
          <div
            style={{
              color: "#F83236",
              display: "flex",
              fontFamily: "Tinos",
              fontSize: 168,
              fontWeight: 700,
              letterSpacing: -10,
              lineHeight: 0.95,
              marginLeft: -6,
            }}
          >
            Christmas
          </div>
          <div style={{ display: "flex", fontFamily: "Tinos", fontSize: 52, fontStyle: "italic", lineHeight: 1, marginLeft: 220 }}>
            At Vertical Church
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Overpass",
              fontSize: 30,
              fontWeight: 700,
              gap: 8,
              letterSpacing: 1,
              marginTop: 44,
              textTransform: "uppercase",
            }}
          >
            <span>Christmas Eve at 4PM</span>
            <span>5400 Lear Nagle Rd</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Tinos", data: bold, style: "normal", weight: 700 },
        { name: "Tinos", data: italic, style: "italic", weight: 400 },
        { name: "Overpass", data: overpassBold, style: "normal", weight: 700 },
      ],
    }
  );
}
