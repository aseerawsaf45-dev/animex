import { Variants } from "framer-motion";

// Custom Easings (Apple Reveal × Japanese Cinema)
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_INK = [0.22, 1, 0.36, 1] as const;
export const EASE_SPRING = { type: "spring", stiffness: 300, damping: 25 };

// 05 — Anime Card Cinematic Entrance (Opacity + Scale + Blur + Translate)
export const cardEntranceVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 24,
    filter: "blur(8px)",
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: EASE_EXPO,
      delay: custom * 0.07, // 70ms stagger per card
    },
  }),
};

// 17 — Japanese Scroll Reveal (Clip-Path + Translate)
export const scrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    clipPath: "inset(20% 0 0 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.8,
      ease: EASE_EXPO,
    },
  },
};

// 29 — Editorial Text Reveal Line-by-Line
export const textLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
    clipPath: "inset(100% 0 0 0)",
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: "0%",
    clipPath: "inset(0% 0 0 0)",
    transition: {
      duration: 0.7,
      ease: EASE_INK,
      delay: i * 0.12,
    },
  }),
};

// 01 — Cinematic Hero Timeline Variants
export const heroInkVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_INK },
  },
};

export const heroVideoVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 0.6,
    scale: 1,
    transition: { duration: 1.2, ease: EASE_EXPO, delay: 0.4 },
  },
};

export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_EXPO, delay: 0.7 },
  },
};

export const heroCtaVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_EXPO, delay: 1.1 },
  },
};
