import { SendNetworkLogo } from "./icons";

export function PartnersBanner() {
  return (
    <section className="relative bg-sky pb-12 pt-16 md:py-20">
      <h2 className="absolute left-0 right-0 top-4 text-center font-heading text-sm font-semibold uppercase tracking-[0.15em] text-pipper/70 md:top-6">
        Church Planting Partners:
      </h2>
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
        <a
          href="https://www.namb.net/send-network/send-city/cleveland/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <SendNetworkLogo className="h-10 w-auto md:h-12" color="#E8E4DD" />
        </a>
        <a
          href="https://www.clevelandhope.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <img
            src="https://vertical-church.t3.storage.dev/cle-hope.webp"
            alt="Cleveland Hope"
            className="h-14 w-auto md:h-16"
          />
        </a>
      </div>
    </section>
  );
}
