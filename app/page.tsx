import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Welcome } from "./components/Welcome";
import { MinistryCards } from "./components/MinistryCards";
import { Marquee } from "./components/Marquee";
import { FeatureSection } from "./components/FeatureSection";
import { PartnersBanner } from "./components/PartnersBanner";
import { Footer } from "./components/Footer";

const heroImages = {
  main: {
    src: "https://vertical-church.t3.storage.dev/home-hero-1.png",
    alt: "Pastor preaching",
  },
  secondary: [
    { src: "https://vertical-church.t3.storage.dev/hero-home-2.png", alt: "Worship service" },
    { src: "https://vertical-church.t3.storage.dev/hero-home-3.png", alt: "Church community" },
  ],
};

const heroTitle = (
  <>
    Show up for
    <br />
    church.
    <br />
    <span className="text-florence">
      End up with
      <br />
      family
    </span>
  </>
);

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <Hero
          mainImage={heroImages.main}
          secondaryImages={heroImages.secondary}
          title={heroTitle}
          showCTAs
        />
        <Welcome />
        <MinistryCards showGetInvolvedButton />
        <Marquee />
        <FeatureSection />
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
