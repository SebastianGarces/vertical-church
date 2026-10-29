import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Vertical Church handles information submitted through vertical.family.",
  alternates: {
    canonical: "/privacy",
  },
};

const linkClassName =
  "text-florence underline underline-offset-4 transition-colors hover:text-pipper";

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "What this policy covers",
    body: "This policy explains how Vertical Church handles information submitted through vertical.family. It applies to the public website and its forms. It does not cover services run by other organizations after you follow an external link.",
  },
  {
    title: "Information you provide",
    body: "The contact, plan-a-visit, small-group, and serving forms ask for your name, email address, and sometimes a phone number. Depending on the form, you may also share a message, visit details, family or childcare needs, ministry interests, city, age range, or group preferences. Please only send information you are comfortable sharing with the church.",
  },
  {
    title: "How the church uses form submissions",
    body: "Vertical Church uses submitted information to respond to your message, plan a visit, connect you with a small group or serving opportunity, and coordinate follow-up. The site checks forms for automated spam before processing them. Church staff receive form notifications through email.",
  },
  {
    title: "Service providers",
    body: "The site sends form information to the church management software Vertical Church uses, so staff can create or update a people record. An email delivery provider sends form notifications to church recipients. A website hosting and performance-measurement provider runs the site and measures how its pages perform. Each provider handles information under its own terms and privacy practices.",
  },
  {
    title: "Google Analytics",
    body: (
      <>
        The site uses Google Analytics to understand how visitors use the site and to measure form
        submissions. Google Analytics uses cookies and similar technologies to collect information
        such as pages viewed and general device and location details. The site does not send your
        name, email address, phone number, or message to Google Analytics. Learn{" "}
        <a className={linkClassName} href="https://policies.google.com/technologies/partner-sites">
          how Google uses information from sites or apps that use its services
        </a>
        . You can opt out with the{" "}
        <a className={linkClassName} href="https://tools.google.com/dlpage/gaoptout">
          Google Analytics opt-out browser add-on
        </a>
        .
      </>
    ),
  },
  {
    title: "Your choices",
    body: "You can choose not to submit a form. If you have a question about information you submitted, contact Vertical Church through the contact page or by phone at 440.420.7335. The church can then direct your question to the right person.",
  },
  {
    title: "Updates to this policy",
    body: "Vertical Church may update this page when the website or its data practices change. The date below shows when this version was published.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
        <section className="mx-auto max-w-5xl">
          <p className="font-button text-sm uppercase tracking-[0.2em] text-florence">
            Vertical Church
          </p>
          <h1 className="mt-5 max-w-3xl font-tagline text-5xl font-bold italic leading-[0.95] tracking-tight text-pipper md:text-7xl">
            Privacy policy
          </h1>
          <p className="mt-7 max-w-2xl font-body text-lg leading-relaxed text-pipper/75 md:text-xl">
            A clear account of the information the website receives and where it goes.
          </p>
          <p className="mt-10 border-y border-pipper/20 py-4 font-button text-xs uppercase tracking-[0.16em] text-pipper/55">
            Last updated October 29, 2026
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-5xl divide-y divide-pipper/15 border-y border-pipper/15">
          {sections.map((section, index) => (
            <article className="grid gap-5 py-8 md:grid-cols-[11rem_1fr] md:gap-10 md:py-10" key={section.title}>
              <p className="font-button text-sm text-florence">0{index + 1}</p>
              <div>
                <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-pipper md:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-pipper/75 md:text-lg">
                  {section.body}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-5xl rounded-sm bg-florence p-6 text-navy md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.04em]">
              Questions about this policy?
            </h2>
            <p className="mt-2 font-body text-base leading-relaxed text-navy/75">
              Send a note through the church contact form.
            </p>
          </div>
          <Link
            className="mt-5 inline-flex border-2 border-navy px-5 py-3 font-button text-sm font-bold uppercase tracking-[0.16em] transition-colors hover:bg-navy hover:text-pipper md:mt-0"
            href="/contact"
          >
            Contact us
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
