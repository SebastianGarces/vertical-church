import { Header } from "../components/Header";
import { VideoHero } from "../components/VideoHero";
import { MinistryCards } from "../components/MinistryCards";
import { Marquee } from "../components/Marquee";
import { Footer } from "../components/Footer";
import { PartnersBanner } from "../components/PartnersBanner";
import {
  OurHistory,
  OurMission,
  MissionExplanation,
  PastorBio,
  OurPillars,
  OurPrinciples,
  OurVision,
  Leadership,
} from "./components";

const heroTitle = (
  <>
    About
    <br />
    <span className="text-florence">Vertical Church</span>
  </>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <VideoHero
          vimeoVideoId="1149729682"
          vimeoHash="31b1e08f78"
          title={heroTitle}
        />
        <OurHistory />
        <OurMission />
        <MissionExplanation />
        <PastorBio />
        <MinistryCards />
        <OurPillars />
        <Marquee />
        <OurPrinciples />
        <OurVision />
        <Leadership />
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
