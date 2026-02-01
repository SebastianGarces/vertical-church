import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Marquee } from "../components/Marquee";
import { PartnersBanner } from "../components/PartnersBanner";
import {
  PageIntro,
  NextSteps,
  Ministries,
  SmallGroups,
  ServeTeams,
} from "./components";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Discover ways to connect and serve at Vertical Church. Join a small group, find your place on a serve team, and take your next steps in faith.",
  alternates: {
    canonical: "/get-involved",
  },
};

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <PageIntro />
        <NextSteps />
        <Ministries />
        <Marquee />
        <SmallGroups />
        <ServeTeams />
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
