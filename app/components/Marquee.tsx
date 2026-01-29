"use client";

const phrases = [
  "Worship Christ",
  "Walk With Christ",
  "Work For Christ",
  "Witness for Christ",
];

function MarqueeContent() {
  return (
    <>
      {phrases.map((phrase, index) => (
        <span
          key={index}
          className="mx-8 font-heading text-6xl font-bold uppercase tracking-tight text-pipper/70 md:mx-16 md:text-8xl lg:text-[10rem]"
        >
          {phrase}
        </span>
      ))}
    </>
  );
}

export function Marquee() {
  return (
    <section className="overflow-hidden bg-navy py-8 md:py-12">
      <div className="relative flex">
        <div className="animate-marquee flex whitespace-nowrap">
          <MarqueeContent />
        </div>
        <div className="animate-marquee flex whitespace-nowrap" aria-hidden="true">
          <MarqueeContent />
        </div>
      </div>
    </section>
  );
}
