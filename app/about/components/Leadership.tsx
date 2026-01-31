"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  leadership,
  LeadershipMember,
  Elder,
  SmallGroupLeader,
} from "../data/leadership";

function PersonCard({
  name,
  role,
  image,
  index,
}: {
  name: string;
  role: string;
  image: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col"
    >
      <div className="overflow-hidden rounded-[20px]">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
          className="h-auto w-full"
        />
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-pipper">
        {name}
      </h3>
      <p className="mt-1 font-body text-sm text-pipper/60">{role}</p>
    </motion.div>
  );
}

function ElderCard({
  elder,
  index,
}: {
  elder: Elder;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col"
    >
      <div className="overflow-hidden rounded-[20px]">
        <Image
          src={elder.image}
          alt={elder.name}
          width={400}
          height={500}
          className="h-auto w-full"
        />
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-pipper">
        {elder.name}
      </h3>
      <p className="mt-1 font-body text-sm text-pipper/60">{elder.role}</p>
      {elder.church && elder.churchUrl && (
        <a
          href={elder.churchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 font-body text-sm text-florence hover:underline"
        >
          {elder.church}
        </a>
      )}
    </motion.div>
  );
}

function SmallGroupCard({
  leader,
  index,
}: {
  leader: SmallGroupLeader;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col"
    >
      <div className="overflow-hidden rounded-[20px]">
        <Image
          src={leader.image}
          alt={leader.names}
          width={400}
          height={500}
          className="h-auto w-full"
        />
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-pipper">
        {leader.names}
      </h3>
      <p className="mt-1 font-body text-sm text-pipper/60">Small Group Leaders</p>
    </motion.div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      {subtitle && (
        <p className="font-body text-sm uppercase tracking-[0.1em] text-florence">
          {subtitle}
        </p>
      )}
      <h3 className="mt-1 font-heading text-xl font-bold uppercase tracking-wide text-pipper md:text-2xl">
        {title}
      </h3>
    </motion.div>
  );
}

export function Leadership() {
  return (
    <section id="leadership" className="bg-navy py-16 md:py-24 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.05em] text-pipper md:text-4xl">
            Our Leadership
          </h2>
        </motion.div>

        {/* Staff Section */}
        {leadership.staff.length > 0 && (
          <div className="mt-12">
            <SectionHeader title="Staff" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {leadership.staff.map((member, index) => (
                <PersonCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Leadership Section */}
        {leadership.leadership.length > 0 && (
          <div className="mt-16">
            <SectionHeader title="Leadership" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {leadership.leadership.map((member, index) => (
                <PersonCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Small Groups Section */}
        {leadership.smallGroupLeaders.length > 0 && (
          <div className="mt-16">
            <SectionHeader title="Small Groups" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {leadership.smallGroupLeaders.map((leader, index) => (
                <SmallGroupCard
                  key={leader.names}
                  leader={leader}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Elders Section */}
        {leadership.elders.length > 0 && (
          <div className="mt-16">
            <SectionHeader title="Elders" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {leadership.elders.map((elder, index) => (
                <ElderCard key={elder.name} elder={elder} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
