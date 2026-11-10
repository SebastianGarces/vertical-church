import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { FAQ, ServiceInfo, WhatToExpect } from "../visit/components";
import type { FAQItem } from "../visit/components/FAQ";
import type { Expectation } from "../visit/components/WhatToExpect";
import { JsonLd } from "@/lib/json-ld";
import { CHRISTMAS_GATHERING, CHURCH_PHONE } from "@/lib/christmas";
import { ChristmasHero } from "./components/ChristmasHero";
import { ClosingCTA } from "./components/ClosingCTA";
import { Directions } from "./components/Directions";
import { Invitation } from "./components/Invitation";
import { PlanVisitDialogProvider } from "./components/PlanVisitDialog";
import { christmasDisplay, christmasScript, christmasSerif } from "./fonts";
import "./christmas.css";

const title = "Christmas Eve at Vertical Church";
const description =
  "You're invited to celebrate the hope of Jesus with us this Christmas. Join Vertical Church on Christmas Eve at 4 PM at 5400 Lear Nagle Rd, North Ridgeville, Ohio.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://www.vertical.family/christmas",
  },
  openGraph: {
    title,
    description,
    url: "https://www.vertical.family/christmas",
  },
  twitter: {
    title,
    description,
  },
};

// Copy from the campaign plan (section 5). Kept to confirmed details only.
const expectations: Expectation[] = [
  {
    number: "01",
    title: "Come As You Are",
    description:
      "Come as you are. We'll be glad to meet you, help you find your way, and celebrate the good news of Jesus together.",
  },
  {
    number: "02",
    title: "Worship",
    description:
      "We'll sing together and celebrate the heart of Christmas: God sent His Son, Jesus Christ, into the world to save us.",
  },
  {
    number: "03",
    title: "Bible Teaching",
    description:
      "We'll open God's Word together and hear the good news of the hope we have in Jesus.",
  },
];

const faqs: FAQItem[] = [
  {
    question: "When and where is the Christmas gathering?",
    answer: `${CHRISTMAS_GATHERING.day}, ${CHRISTMAS_GATHERING.date}, at ${CHRISTMAS_GATHERING.time}, at ${CHRISTMAS_GATHERING.street}, ${CHRISTMAS_GATHERING.cityStateZip}.`,
  },
  {
    question: "Do I have to be a Christian to come?",
    answer:
      "Absolutely not! The church is open to all who seek God and the truth that He has given to mankind. Just don't be surprised when we talk about Jesus.",
  },
  {
    question: "Can I bring my family?",
    answer: "Yes! We'd love to meet you and welcome your family as we celebrate the hope of Jesus together.",
  },
  {
    question: "Where do I park?",
    answer:
      "Parking is free in our lot right next to the building, with room for about 80 cars. From there it's a short walk to the door.",
  },
  {
    question: "Do I need to fill out the Plan Your Visit form?",
    answer:
      "It's optional. Fill it out if you'd like us to know you're coming, or if you'd like someone to reach out to you before Christmas Eve.",
  },
  {
    question: "I have another question. Who can I ask?",
    answer: (
      <>
        Call us at{" "}
        <a href={CHURCH_PHONE.href} className="whitespace-nowrap text-navy underline underline-offset-4">
          {CHURCH_PHONE.display}
        </a>{" "}
        or{" "}
        <Link href="/contact" className="text-navy underline underline-offset-4">
          send us a message
        </Link>
        . We&apos;d be glad to help.
      </>
    ),
  },
];

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Christmas Eve at Vertical Church",
  description,
  startDate: CHRISTMAS_GATHERING.startDate,
  url: "https://www.vertical.family/christmas",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Vertical Church",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5400 Lear Nagle Rd",
      addressLocality: "North Ridgeville",
      addressRegion: "OH",
      postalCode: "44039",
      addressCountry: "US",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Vertical Church",
    url: "https://www.vertical.family",
  },
  isAccessibleForFree: true,
};

export default function ChristmasPage() {
  return (
    <div
      className={`christmas-theme christmas-paper min-h-screen overflow-x-hidden ${christmasDisplay.variable} ${christmasSerif.variable} ${christmasScript.variable}`}
    >
      <JsonLd data={eventSchema} />
      <PlanVisitDialogProvider>
        <Header />
        <main>
          <ChristmasHero />
          <Invitation />
          <ServiceInfo timeLabel="Christmas Eve · Thursday, Dec 24" time="4 PM" />
          <WhatToExpect
            heading="What to Expect"
            subheading="On Christmas Eve"
            intro="You'll find the gathering details and practical information on this page. If you have any questions before coming, please reach out."
            items={expectations}
          />
          <Directions />
          <FAQ faqs={faqs} eyebrow="Questions?" heading="Christmas FAQ" />
          <ClosingCTA />
        </main>
      </PlanVisitDialogProvider>
      <Footer />
    </div>
  );
}
