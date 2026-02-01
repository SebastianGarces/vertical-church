'use client';

import { motion } from 'motion/react';

export function OurHistory() {
  return (
    <section className='bg-navy pt-8 pb-16 md:pt-12 md:pb-24'>
      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='font-heading text-3xl font-bold uppercase tracking-[0.05em] text-pipper md:text-5xl'>
            Our History
          </h2>
          <p className='mt-2 font-body text-sm uppercase tracking-[0.1em] text-pipper/50'>
            Rooted in Partnership, Built on Legacy
          </p>

          <div className='mt-8 max-w-3xl space-y-6 font-body text-base leading-relaxed text-pipper/70 md:text-lg'>
            <p>
              Vertical Church North exists because of God’s faithfulness and the vision of gospel-centered churches
              committed to multiplying.
            </p>
            <p>
              In 2024, Gateway Church in North Eaton partnered with Vertical Church in Columbus to plant a new church in
              North Ridgeville. Gateway has long carried a heart for church planting across Lorain County, while
              Vertical Columbus brings the DNA of the Vertical Church family, committed to multiplying life-giving,
              Christ-centered churches.
            </p>
            <p>
              This new plant began in a building that has served as a place of worship and gospel witness in North
              Ridgeville for decades. By God’s grace, Vertical Church North is carrying that legacy forward with fresh
              vision and renewed passion.
            </p>
            <p>
              From the very beginning, our desire has been simple: to see people encounter Jesus, grow as His disciples,
              and live on mission together for the glory of God.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
