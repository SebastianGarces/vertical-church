import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { PartnersBanner } from "../components/PartnersBanner";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { FAQ, PlanVisitForm, ServiceInfo, WhatToExpect } from "./components";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Plan your visit to Vertical Church in North Ridgeville, Ohio. Join us Sundays at 10am for worship. Learn what to expect and let us know you're coming.",
  alternates: {
    canonical: "/visit",
  },
};

const heroImages = {
  main: {
    src: "https://vertical-church.t3.storage.dev/hero-visit-1.png",
    alt: "Welcome to Vertical Church",
  },
  secondary: [
    { src: "https://vertical-church.t3.storage.dev/hero-visit-2.png", alt: "Church community" },
    { src: "https://vertical-church.t3.storage.dev/hero-visit-3.png", alt: "Children's ministry experience" },
  ],
};

const heroTitle = (
  <>
    Plan Your
    <br />
    <span className="text-florence">
      Visit
    </span>
  </>
);

export default function VisitPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <Hero
          mainImage={heroImages.main}
          secondaryImages={heroImages.secondary}
          title={heroTitle}
          titleBottomOffset="bottom-12 lg:bottom-16"
          mobileTitleBottomOffset="-bottom-12"
        />
        <ServiceInfo />
        <WhatToExpect />
        <FAQ />
        <Marquee />
        <PlanVisitForm />
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
