'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export function PastorBio() {
  return (
    <section className='bg-navy py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 md:px-8'>
        <div className='overflow-hidden rounded-lg bg-salte/20 md:flex'>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className='relative aspect-[4/3] md:aspect-auto md:w-1/2'
          >
            <Image
              src='https://vertical-church.t3.storage.dev/nass-family.JPG'
              alt='Pastor Bryan and Sara Nass'
              fill
              sizes='(max-width: 768px) 100vw, 50vw'
              className='object-cover'
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='flex flex-col justify-center p-6 md:w-1/2 md:p-10'
          >
            <span className='font-heading text-sm uppercase tracking-[0.15em] text-florence md:text-[32px]'>
              About Pastor Bryan & Sara Nass
            </span>

            <div className='mt-4 space-y-4 font-body text-sm leading-relaxed text-pipper/70 md:text-base'>
              <p>
                Pastor Bryan was born and raised in Lorain County. After high school, he began pursuing a degree in
                business management—but while volunteering in the student ministry at his local church, God changed
                Bryan&apos;s heart and direction. He responded to God&apos;s call into full-time ministry and attended
                Moody Bible Institute, where he met his wife, Sara. Bryan graduated in 2012 with a B.A. in Student
                Ministry, and Sara graduated with a B.A. in Women&apos;s Ministry and Biblical Exposition. Bryan then
                served for the next 10 years as a youth pastor while Sara worked in pregnancy help centers and taught
                the Bible at a Christian school.
              </p>
              <p>
                In time, God began leading Bryan and Sara toward church planting. Through a series of closed
                doors—and God&apos;s clear direction and provision through training with the SEND Network and a church
                planting residency at Vertical Church Columbus—the Nasses prepared to plant Vertical Church North in
                Lorain County. In October 2024, Vertical Church North officially launched, and Bryan and Sara now
                serve the church as it continues to grow in worship, discipleship, and gospel-centered community
                throughout the region. We&apos;d love to connect with you—{' '}
                <a href='/contact' className='text-florence hover:underline'>
                  reach out
                </a>{' '}
                to learn more, visit on a Sunday, and find ways to get involved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
