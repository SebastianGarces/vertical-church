import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Vertical Church. Show up for church. End up with family.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [logo, coinMark, overpassBold] = await Promise.all([
    readFile(join(process.cwd(), "public", "vertical-main-logo.svg")),
    readFile(join(process.cwd(), "public", "vertical-coin-solid-logo.svg")),
    fetch(
      "https://fonts.gstatic.com/s/overpass/v19/qFda35WCmI96Ajtm83upeyoaX6QPnlo6G_TrOQ.ttf"
    ).then(async (response) => {
      if (!response.ok) {
        throw new Error("Unable to load the Overpass bold font.");
      }

      return response.arrayBuffer();
    }),
  ]);
  const logoSource = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const coinSource = `data:image/svg+xml;base64,${coinMark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#141C25",
          color: "#FFFFFF",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <img
          alt="Vertical Church community outreach at a local event"
          height="630"
          src="https://vertical-church.t3.storage.dev/corn-festival.jpg"
          style={{
            filter: "grayscale(100%)",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            position: "absolute",
            width: "100%",
          }}
          width="1200"
        />
        <div
          style={{
            background: "rgba(20, 28, 37, 0.75)",
            height: "100%",
            left: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }}
        />
        <img
          alt=""
          height="108"
          src={coinSource}
          style={{
            bottom: 58,
            height: 108,
            opacity: 0.2,
            position: "absolute",
            right: 76,
            width: 108,
          }}
          width="108"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            inset: 0,
            padding: "64px 76px",
            position: "absolute",
          }}
        >
          <img
            alt="Vertical Church"
            height="55"
            src={logoSource}
            style={{
              display: "flex",
              height: 55,
              objectFit: "contain",
              width: 240,
            }}
            width="240"
          />
          <div
            style={{
              background: "#FF5231",
              height: 7,
              marginTop: 88,
              width: 128,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Overpass",
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: -2.5,
              lineHeight: 0.98,
              marginTop: 66,
              maxWidth: 760,
              textTransform: "uppercase",
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>Show up for church.</span>
            <span style={{ color: "#FF5231", marginTop: 10 }}>
              End up with family.
            </span>
          </div>
          <div
            style={{
              borderTop: "2px solid rgba(255,255,255,0.28)",
              display: "flex",
              fontFamily: "sans-serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 3,
              marginTop: 96,
              paddingTop: 24,
              textTransform: "uppercase",
              width: 730,
            }}
          >
            North Ridgeville, Ohio
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Overpass",
          data: overpassBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
