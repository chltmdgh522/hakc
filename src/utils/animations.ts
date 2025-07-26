import type { Variants } from 'framer-motion';

// 공통 애니메이션 variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpVariants: Variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -40, opacity: 0 },
};

export const slideInLeftVariants: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

export const scaleVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

// 호버 애니메이션
export const hoverScaleVariants: Variants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const hoverLiftVariants: Variants = {
  hover: { 
    y: -5,
    boxShadow: '0 8px 24px rgba(91, 147, 198, 0.18)',
  },
  tap: { y: 0 },
};

// 로딩 애니메이션
export const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const pulseVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

// 트랜지션 설정
export const transitions = {
  fast: { duration: 0.2 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
  easeOut: { duration: 0.4, ease: 'easeOut' },
  easeInOut: { duration: 0.4, ease: 'easeInOut' },
} as const; 