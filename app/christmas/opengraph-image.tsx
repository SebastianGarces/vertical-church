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
  const [display, script, overpassBold] = await Promise.all([
    loadFont("https://fonts.gstatic.com/s/dmserifdisplay/v17/-nFnOHM81r4j6k0gjAW3mujVU2B2K_c.ttf", "DM Serif Display"),
    loadFont("https://fonts.gstatic.com/s/mrdehaviland/v15/OpNVnooIhJj96FdB73296ksbOj3C.ttf", "Mr De Haviland"),
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
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Mr De Haviland", fontSize: 84, lineHeight: 1, marginLeft: -420 }}>
          Join us for
        </div>
        <div
          style={{
            color: "#F83236",
            display: "flex",
            fontFamily: "DM Serif Display",
            fontSize: 250,
            letterSpacing: -14,
            lineHeight: 0.9,
          }}
        >
          Christmas
        </div>
        <div style={{ display: "flex", fontFamily: "Mr De Haviland", fontSize: 84, lineHeight: 1, marginLeft: 340 }}>
          At Vertical Church
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontFamily: "Overpass",
            fontSize: 34,
            fontWeight: 700,
            gap: 40,
            letterSpacing: 1,
            marginTop: 40,
            textTransform: "uppercase",
          }}
        >
          <span>Christmas Eve at 4PM</span>
          <div style={{ background: "#F83236", borderRadius: 999, height: 14, width: 14 }} />
          <span>5400 Lear Nagle Rd</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Serif Display", data: display, style: "normal", weight: 400 },
        { name: "Mr De Haviland", data: script, style: "normal", weight: 400 },
        { name: "Overpass", data: overpassBold, style: "normal", weight: 700 },
      ],
    }
  );
}
