import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Fraunces, Overpass, PT_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: "italic",
  display: "swap",
});

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  display: "swap",
});

const ptMono = PT_Mono({
  variable: "--font-pt-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vertical.family"),
  title: {
    template: "%s | Vertical Church",
    default: "Vertical Church",
  },
  description: "Love God. Love People. Serve the World.",
  openGraph: {
    siteName: "Vertical Church",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to image CDN for faster LCP */}
        <link rel="preconnect" href="https://vertical-church.t3.storage.dev" />
        <link rel="dns-prefetch" href="https://vertical-church.t3.storage.dev" />
      </head>
      <body
        className={`${fraunces.variable} ${overpass.variable} ${ptMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
