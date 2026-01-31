import { Suspense } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { PageIntro, EventsList } from "./components";

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Events | Vertical Church",
  description:
    "Join us for worship gatherings, community events, and opportunities to connect at Vertical Church.",
};

function EventsLoading() {
  return (
    <section className="bg-navy pb-16 md:pb-24">
        <div className="mx-auto max-w-[1080px] px-4 md:px-8">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-salte/30 bg-salte/20"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy">
      <Header />
      <main className="pb-16 md:pb-24">
        <PageIntro />
        <Suspense fallback={<EventsLoading />}>
          <EventsList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
