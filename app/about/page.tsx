import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { MinistryCards } from "../components/MinistryCards";
import { Marquee } from "../components/Marquee";
import { Footer } from "../components/Footer";
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

const heroImages = {
  main: {
    src: "https://vertical-church.t3.storage.dev/hero-about-1.png",
    alt: "Church community worship",
  },
  secondary: [
    { src: "https://vertical-church.t3.storage.dev/hero-about-2.png", alt: "Worship service" },
    { src: "https://vertical-church.t3.storage.dev/hero-about-3.png", alt: "Church community" },
  ],
};

const heroTitle = (
  <>
    About
    <br />
    <span className="text-florence">
      Vertical
      <br />
      Church
    </span>
  </>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main>
        <Hero
          mainImage={heroImages.main}
          secondaryImages={heroImages.secondary}
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
      <Footer />
    </div>
  );
}
