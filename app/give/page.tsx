"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { Footer } from "../components/Footer";
import { PartnersBanner } from "../components/PartnersBanner";
import { Header } from "../components/Header";

function PageIntro() {
  return (
    <section className="bg-navy pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading text-3xl font-bold uppercase tracking-[0.05em] text-pipper md:text-5xl">
            Give
          </h1>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Support the Mission
          </p>
          <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-pipper/80 md:text-lg">
            Your generosity makes a difference. Every gift helps us share the
            love of Christ, serve our community, and reach more people with the
            Gospel.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function GivingOptions() {
  return (
    <section className="bg-navy pb-16 md:pb-24">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Online Giving */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-cream p-6 md:p-8"
          >
            <span className="font-heading text-sm uppercase tracking-[0.15em] text-florence">
              01
            </span>
            <h2 className="mt-2 font-heading text-xl font-bold uppercase tracking-wide text-navy md:text-2xl">
              Give Online
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy/70 md:text-base">
              The easiest way to give is through our secure online giving
              platform. You can make a one-time gift or set up recurring giving
              to support the church regularly.
            </p>
            <Link
              href="https://verticalchurchnorth.churchcenter.com/giving"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border-2 border-navy bg-navy px-6 py-3 font-button text-base font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-navy/90"
            >
              Give Now
              <ExternalLink className="h-5 w-5" />
            </Link>
          </motion.div>

          {/* Mail a Check */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-lg bg-cream p-6 md:p-8"
          >
            <span className="font-heading text-sm uppercase tracking-[0.15em] text-florence">
              02
            </span>
            <h2 className="mt-2 font-heading text-xl font-bold uppercase tracking-wide text-navy md:text-2xl">
              Mail a Check
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy/70 md:text-base">
              If you prefer to give by check, please make it payable to:
            </p>
            <p className="mt-3 font-heading text-base font-semibold text-navy md:text-lg">
              Vertical Church North
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy/70 md:text-base">
              And mail it to:
            </p>
            <address className="mt-3 font-body text-base not-italic text-navy md:text-lg">
              5400 Lear Nagle Rd
              <br />
              North Ridgeville, OH 44039
            </address>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ThankYou() {
  return (
    <section className="bg-navy pb-16 md:pb-24">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mx-auto max-w-xl font-body text-base italic leading-relaxed text-pipper/70 md:text-lg">
            &ldquo;Each of you should give what you have decided in your heart
            to give, not reluctantly or under compulsion, for God loves a
            cheerful giver.&rdquo;
          </p>
          <p className="mt-4 font-body text-sm text-florence">
            2 Corinthians 9:7
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function GivePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <PageIntro />
        <GivingOptions />
        <ThankYou />
      </main>
      <PartnersBanner />
      <Footer />
    </div>
  );
}
