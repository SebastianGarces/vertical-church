"use client";

import { motion } from "motion/react";
import { Car, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import {
  CHRISTMAS_GATHERING,
  CHURCH_PHONE,
  GOOGLE_MAPS_DIRECTIONS_URL,
  GOOGLE_MAPS_EMBED_URL,
} from "@/lib/christmas";
import { Doodle } from "./Doodle";

/**
 * Parking, directions with a map, and a contact option. The detail cards follow the
 * /contact page's info cards (icon chip, uppercase title, body line).
 */
export function Directions() {
  return (
    <section id="directions" className="relative scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-end gap-3">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
              Getting Here
            </h2>
            <Doodle name="star" idle="twinkle" className="mb-1 w-8 shrink-0 md:w-10" />
          </div>
          <p className="mt-2 font-body text-sm uppercase tracking-[0.1em] text-florence">
            Directions &amp; Parking
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8">
          <div className="grid gap-4 md:gap-6">
            {[
              {
                icon: MapPin,
                title: "Address",
                body: (
                  <>
                    <p>
                      {CHRISTMAS_GATHERING.street}
                      <br />
                      {CHRISTMAS_GATHERING.cityStateZip}
                    </p>
                    <a
                      href={GOOGLE_MAPS_DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-button text-sm font-bold uppercase tracking-[0.15em] text-pipper underline decoration-florence decoration-2 underline-offset-4 hover:text-florence"
                    >
                      Get directions<span className="sr-only"> (opens Google Maps)</span>
                    </a>
                  </>
                ),
              },
              {
                icon: Car,
                title: "Parking & Entrance",
                body: (
                  <p>
                    Parking is free in our lot right next to the building, with room for about 80 cars.
                    From there it&apos;s a short walk to the door.
                  </p>
                ),
              },
              {
                icon: Phone,
                title: "Questions?",
                body: (
                  <p>
                    Call us at{" "}
                    <a href={CHURCH_PHONE.href} className="whitespace-nowrap text-pipper underline underline-offset-4 hover:text-florence">
                      {CHURCH_PHONE.display}
                    </a>{" "}
                    or{" "}
                    <Link href="/contact" className="text-pipper underline underline-offset-4 hover:text-florence">
                      send us a message
                    </Link>
                    . We&apos;d be glad to help before you come.
                  </p>
                ),
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 rounded-lg border border-pipper/20 p-5 md:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-florence/20">
                  <card.icon className="h-5 w-5 text-pipper" aria-hidden="true" />
                </div>
                <div className="font-body text-base leading-relaxed text-pipper/80">
                  <h3 className="mb-1 font-heading text-lg font-bold uppercase tracking-wide text-pipper">
                    {card.title}
                  </h3>
                  {card.body}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative min-h-[18rem] overflow-hidden rounded-[20px] border-2 border-pipper/20 bg-pipper/5 lg:min-h-full"
          >
            <iframe
              title="Map: Vertical Church, 5400 Lear Nagle Rd, North Ridgeville, OH"
              src={GOOGLE_MAPS_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
