import Link from "next/link";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="flex min-h-[calc(100vh-20rem)] items-center px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
        <section className="mx-auto w-full max-w-5xl border-y border-pipper/20 py-10 md:py-16">
          <p className="font-button text-sm uppercase tracking-[0.2em] text-florence">
            Error 404
          </p>
          <h1 className="mt-5 max-w-3xl font-tagline text-5xl font-bold italic leading-[0.95] tracking-tight text-pipper md:text-7xl">
            This page isn&apos;t here.
          </h1>
          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-pipper/75 md:text-xl">
            The link may be out of date, or the page may have moved. Start with one of the paths below.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm bg-pipper/20 sm:grid-cols-2">
            {[
              { href: "/", label: "Home", detail: "Meet Vertical Church" },
              { href: "/visit", label: "Plan a visit", detail: "Service details and a visit form" },
              { href: "/about", label: "About", detail: "Mission, beliefs, and leadership" },
              { href: "/watch", label: "Watch", detail: "Recent sermons and series" },
              { href: "/sitemap.xml", label: "Sitemap", detail: "All public site routes" },
              { href: "/llms.txt", label: "Agent guide", detail: "A Markdown guide to the church" },
            ].map((link) => (
              <Link
                className="group bg-navy p-5 transition-colors hover:bg-pipper hover:text-navy md:p-6"
                href={link.href}
                key={link.href}
              >
                <span className="block font-heading text-lg font-bold uppercase tracking-[0.08em] text-pipper group-hover:text-navy">
                  {link.label}
                </span>
                <span className="mt-2 block font-body text-sm text-pipper/65 group-hover:text-navy/70">
                  {link.detail}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
