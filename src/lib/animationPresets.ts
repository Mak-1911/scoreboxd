// Animation presets for consistent motion design across the application

export const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  },
  scaleInUp: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  },
  staggerContainer: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  staggerChild: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  // New smooth fade variants for better scroll animations
  smoothFade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  smoothFadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  smoothScaleFade: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
};

export const animationTransitions = {
  default: {
    duration: 0.6,
    ease: "easeOut"
  },
  spring: {
    type: "spring",
    stiffness: 100,
    damping: 15
  },
  smooth: {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1] // Custom easing for smoother animation
  },
  slow: {
    duration: 1.2,
    ease: "easeOut"
  },
  // New slow and smooth transitions for scroll animations
  slowSmooth: {
    duration: 1.0,
    ease: [0.25, 0.1, 0.25, 1]
  }
};

export const animationDefaults = {
  viewport: {
    once: true,
    margin: "-100px"
  },
  transition: animationTransitions.default
};