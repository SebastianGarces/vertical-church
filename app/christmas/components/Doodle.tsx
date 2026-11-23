"use client";

import { motion, type Variants } from "motion/react";

/*
 * Line-art doodles for /christmas, in the spirit of the bow and tree on the printed card.
 * Used sparingly: one small doodle beside a few section headings.
 * All shapes are drawn by hand for this page (no third-party artwork), in a 64x64 box.
 *
 * Motion: each stroke draws in when the doodle scrolls into view, then the whole doodle
 * sways or twinkles gently. With prefers-reduced-motion the doodle shows fully drawn and
 * still: that is done in CSS (.christmas-doodle in christmas.css), not by rendering a
 * different tree, so server and client markup always match (no hydration mismatch).
 * Doodles are decorative: aria-hidden, no pointer events.
 */

export type DoodleName = "star" | "bow" | "tree";

const CREAM = "#EAECEA";
const RED = "#F83236";

type Stroke =
  | { d: string; red?: boolean }
  | { circle: [number, number, number]; red?: boolean };

function starPath(cx: number, cy: number, outer: number, inner: number) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((-90 + i * 36) * Math.PI) / 180;
    points.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${points.join(" L")} Z`;
}

const SHAPES: Record<DoodleName, Stroke[]> = {
  star: [
    { d: starPath(32, 33, 22, 9.5) },
    { d: "M54 10 L54 18 M50 14 L58 14", red: true },
    { d: "M10 46 L10 52 M7 49 L13 49" },
  ],
  bow: [
    { d: "M32 28 C 22 14 8 14 10 24 C 12 33 26 33 32 28" },
    { d: "M32 28 C 42 14 56 14 54 24 C 52 33 38 33 32 28" },
    { circle: [32, 29, 3.5], red: true },
    { d: "M30 32 C 27 40 22 48 16 58 L20 56 L21 60" },
    { d: "M34 32 C 37 40 42 48 48 58 L44 56 L43 60" },
  ],
  tree: [
    { d: "M32 6 L20 24 H27 L15 40 H24 L10 54 H54 L40 40 H49 L37 24 H44 Z" },
    { d: "M28 54 V61 H36 V54" },
    { d: "M25 33 L27 35 L29 33 M35 30 L37 32 L39 30 M22 47 L24 49 L26 47 M33 44 L35 46 L37 44 M41 49 L43 51 L45 49" },
    { d: starPath(32, 5, 5, 2.2), red: true },
  ],
};

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, ease: [0.33, 1, 0.68, 1], delay: 0.15 + i * 0.12 },
      opacity: { duration: 0.01, delay: 0.15 + i * 0.12 },
    },
  }),
};

interface DoodleProps {
  name: DoodleName;
  /** Positioning and size classes (e.g. "absolute left-4 top-10 w-16 md:w-24"). */
  className?: string;
  /** Idle motion once drawn. */
  idle?: "sway" | "twinkle" | "none";
  /** Seconds to offset the idle loop so neighbours don't move in lockstep. */
  phase?: number;
}

export function Doodle({ name, className = "", idle = "sway", phase = 0 }: DoodleProps) {
  const strokes = SHAPES[name];

  const svgProps = {
    viewBox: "0 0 64 64",
    fill: "none",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className: "h-auto w-full overflow-visible",
  };


  const drawSeconds = 0.15 + strokes.length * 0.12 + 1.1;
  const idleAnimation =
    idle === "sway"
      ? { rotate: [0, 4, 0, -4, 0] }
      : idle === "twinkle"
        ? { scale: [1, 1.08, 1], opacity: [1, 0.72, 1] }
        : undefined;

  return (
    <motion.div
      aria-hidden="true"
      className={`christmas-doodle pointer-events-none select-none ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      <motion.div
        className="christmas-doodle-idle"
        style={{ transformOrigin: idle === "sway" ? "50% 0%" : "50% 50%" }}
        variants={
          idleAnimation
            ? {
                hidden: {},
                visible: {
                  ...idleAnimation,
                  transition: {
                    delay: drawSeconds + phase,
                    duration: idle === "sway" ? 6 : 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }
            : undefined
        }
      >
        <svg {...svgProps}>
          {strokes.map((s, i) =>
            "d" in s ? (
              <motion.path key={i} d={s.d} stroke={s.red ? RED : CREAM} variants={draw} custom={i} />
            ) : (
              <motion.circle
                key={i}
                cx={s.circle[0]}
                cy={s.circle[1]}
                r={s.circle[2]}
                stroke={s.red ? RED : CREAM}
                variants={draw}
                custom={i}
              />
            ),
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
}
