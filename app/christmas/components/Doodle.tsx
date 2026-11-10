"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/*
 * Line-art doodles for /christmas, in the spirit of the bow and tree on the printed card.
 * All shapes are drawn by hand for this page (no third-party artwork), in a 64x64 box.
 *
 * Motion: each stroke draws in when the doodle scrolls into view, then the whole doodle
 * sways or twinkles gently. With prefers-reduced-motion the doodle renders static.
 * Doodles are decorative: aria-hidden, no pointer events.
 */

export type DoodleName = "star" | "ornament" | "holly" | "candle" | "snowflake" | "bow" | "tree" | "gift";

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

function snowflakeStrokes(): Stroke[] {
  const strokes: Stroke[] = [];
  for (let i = 0; i < 6; i++) {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    const x = (r: number, da = 0) => (32 + r * Math.cos(a + da)).toFixed(1);
    const y = (r: number, da = 0) => (32 + r * Math.sin(a + da)).toFixed(1);
    strokes.push({ d: `M32 32 L${x(24)} ${y(24)}` });
    // Little V branch two-thirds of the way out.
    strokes.push({ d: `M${x(21, -0.32)} ${y(21, -0.32)} L${x(15)} ${y(15)} L${x(21, 0.32)} ${y(21, 0.32)}` });
  }
  strokes.push({ circle: [32, 32, 3], red: true });
  return strokes;
}

const SHAPES: Record<DoodleName, Stroke[]> = {
  star: [
    { d: starPath(32, 33, 22, 9.5) },
    { d: "M54 10 L54 18 M50 14 L58 14", red: true },
    { d: "M10 46 L10 52 M7 49 L13 49" },
  ],
  ornament: [
    { d: "M32 4 C 27 4 27 12 32 12 C 37 12 37 4 32 4" },
    { d: "M26 12 H38 V18 H26 Z" },
    { circle: [32, 39, 20] },
    { d: "M13 36 L17.5 40.5 L22 36 L26.5 40.5 L31 36 L35.5 40.5 L40 36 L44.5 40.5 L49 36 L51 38", red: true },
    { d: "M19 27 C 22 23 26 21 30 21" },
  ],
  holly: [
    { d: "M32 34 C 28 30 26 26 21 26 C 22 22 18 19 14 20 C 15 16 12 12 8 12 C 10 18 9 24 13 28 C 10 31 12 35 16 36 C 17 40 22 41 25 39 C 27 39 30 37 32 34 Z" },
    { d: "M32 34 C 24 28 16 20 8 12" },
    { d: "M32 34 C 36 30 38 26 43 26 C 42 22 46 19 50 20 C 49 16 52 12 56 12 C 54 18 55 24 51 28 C 54 31 52 35 48 36 C 47 40 42 41 39 39 C 37 39 34 37 32 34 Z" },
    { d: "M32 34 C 40 28 48 20 56 12" },
    { circle: [28, 42, 4], red: true },
    { circle: [36, 42, 4], red: true },
    { circle: [32, 49, 4], red: true },
  ],
  candle: [
    { d: "M32 22 C 26 16 29 10 32 4 C 35 10 38 16 32 22 Z", red: true },
    { d: "M32 22 V27" },
    { d: "M24 27 H40 V56 H24 Z" },
    { d: "M24 33 C 26 33 26 38 28 38 C 30 38 30 33 32 33" },
    { d: "M14 56 C 14 61 50 61 50 56 Z" },
    { d: "M13 14 L17 17 M51 14 L47 17 M10 24 L15 24 M54 24 L49 24" },
  ],
  snowflake: snowflakeStrokes(),
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
  gift: [
    { d: "M14 30 H50 V58 H14 Z" },
    { d: "M10 22 H54 V30 H10 Z" },
    { d: "M32 22 V58", red: true },
    { d: "M32 22 C 24 10 14 14 20 20 C 23 22 28 22 32 22" },
    { d: "M32 22 C 40 10 50 14 44 20 C 41 22 36 22 32 22" },
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
  const reduceMotion = useReducedMotion();
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

  if (reduceMotion) {
    return (
      <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
        <svg {...svgProps}>
          {strokes.map((s, i) =>
            "d" in s ? (
              <path key={i} d={s.d} stroke={s.red ? RED : CREAM} />
            ) : (
              <circle key={i} cx={s.circle[0]} cy={s.circle[1]} r={s.circle[2]} stroke={s.red ? RED : CREAM} />
            ),
          )}
        </svg>
      </div>
    );
  }

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
      className={`pointer-events-none select-none ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      <motion.div
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
