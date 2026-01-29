"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I have to be a Christian to come?",
    answer:
      "Absolutely not! The church is open to all who seek God and the truth that He has given to mankind. Just don't be surprised when we talk about Jesus.",
  },
  {
    question: "Do I need to bring a Bible?",
    answer:
      "Everyone will be encouraged to have a copy of scripture at home for personal study, but no worries if you need a copy; our ushers would love to provide you with one!",
  },
  {
    question: "Where do my kids go during service?",
    answer:
      "The Vertical Kids ministry will be open for toddlers–6th grade students where they will have an engaging, age-appropriate curriculum to draw their hearts toward Jesus.",
  },
];

export function FAQ() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-sm uppercase tracking-[0.2em] text-florence">
            Questions?
          </h2>
          <p className="mt-4 font-heading text-3xl font-bold uppercase tracking-wide text-navy md:text-4xl">
            Frequently Asked
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-navy/20"
              >
                <AccordionTrigger className="py-6 font-heading text-lg font-semibold text-navy hover:text-florence hover:no-underline md:text-xl [&[data-state=open]]:text-florence">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 font-body text-base leading-relaxed text-navy/70">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
