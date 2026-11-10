"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Doodle } from "./Doodle";
import { PhotoSlot } from "./PhotoSlot";

const BUCKET = "https://vertical-church.t3.storage.dev";

// Past Christmas services at Vertical Church. All three are portrait. The lead photo
// spans two columns and two rows (about 3:4); the other two stack at 3:4 beside it, so
// nothing is cropped hard. Always the .jpg/.JPEG files, never the .heic originals.
const PHOTOS = [
  {
    src: `${BUCKET}/vertical-christmas-3.JPEG`,
    alt: "A woman in a red sweater lights the Advent candles with a young child while another child reads aloud from a Bible, with red poinsettias and a lit Christmas tree on the stage",
    className: "col-span-2 row-span-2",
    sizes: "(min-width: 1152px) 360px, (min-width: 1024px) 32vw, 64vw",
  },
  {
    src: `${BUCKET}/vertical-christmas-2.jpg`,
    alt: "Children sit on the floor listening to a Christmas story, with a Christmas slide on the screen behind them",
    className: "aspect-[3/4]",
    sizes: "(min-width: 1152px) 180px, (min-width: 1024px) 16vw, 32vw",
  },
  {
    src: `${BUCKET}/vertical-christmas-1.jpg`,
    alt: "A single lit candle from a candlelight service, glowing against soft blurred lights",
    className: "aspect-[3/4]",
    sizes: "(min-width: 1152px) 180px, (min-width: 1024px) 16vw, 32vw",
  },
];

/** A photo that falls back to the candle-glow placeholder if it fails to load. */
function InvitePhoto({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <PhotoSlot slot={src.split("/").pop() ?? "photo"} className="h-full w-full" />;
  return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

/**
 * "You're Invited!" block, after the back of the printed card: invitation copy on the
 * left, three photos from past Christmas services on the right. Wording from the card (minus the unconfirmed
 * Dec 27 date) plus the welcome line from the campaign plan.
 */
export function Invitation() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
        <div>
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <div className="flex items-end gap-3">
              <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
                You&apos;re Invited!
              </h2>
              <Doodle name="tree" className="mb-1 w-9 shrink-0 md:w-11" />
            </div>
            <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
              Christmas at Vertical Church
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 max-w-xl space-y-5 font-body text-base leading-relaxed text-pipper/80 md:text-lg"
          >
            <p>
              We&apos;d love for you and your family to join us for our Christmas celebration at Vertical
              Church! It&apos;s a special time of music, joy, and reflection on the true meaning of Christmas.
            </p>
            <p>
              Whether you&apos;ve been in church for years or are thinking about visiting for the first
              time, we&apos;d love to welcome you.
            </p>
            <p>
              Come experience a warm, welcoming community as we celebrate the hope of Jesus together on{" "}
              <strong className="font-bold text-pipper">Christmas Eve at 4 PM</strong>.
            </p>
          </motion.div>
        </div>

        {/* Photo grid: lead portrait (2 cols x 2 rows) with two portraits stacked beside it. */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {PHOTOS.map((photo, index) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-[20px] ${photo.className}`}
            >
              <InvitePhoto src={photo.src} alt={photo.alt} sizes={photo.sizes} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
