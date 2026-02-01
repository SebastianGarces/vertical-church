import { SendNetworkLogo } from "./icons";

export function PartnersBanner() {
  return (
    <section className="relative bg-sky py-16 md:py-20">
      <h2 className="absolute left-0 right-0 top-4 text-center font-heading text-sm font-semibold uppercase tracking-[0.15em] text-pipper/70 md:top-6">
        Church Planting Partners:
      </h2>
      <div className="flex items-center justify-center">
        <SendNetworkLogo className="h-10 w-auto md:h-12" color="#E8E4DD" />
      </div>
    </section>
  );
}
