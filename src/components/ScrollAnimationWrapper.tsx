'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { animationVariants, animationTransitions, animationDefaults } from '@/lib/animationPresets';

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  initial?: string;
  animate?: string;
  exit?: string;
  transition?: any;
  viewport?: any;
  delay?: number;
  once?: boolean;
  style?: React.CSSProperties;
  preset?: keyof typeof animationVariants;
  // New prop to control fade out behavior
  fadeOut?: boolean;
}

const ScrollAnimationWrapper = ({
  children,
  className = '',
  variants,
  initial = 'hidden',
  animate = 'visible',
  exit = 'hidden',
  transition = animationDefaults.transition,
  viewport = animationDefaults.viewport,
  delay = 0,
  once = false, // Changed default to false to allow re-animations
  style,
  preset,
  fadeOut = true, // New prop to control fade out behavior
  ...props
}: ScrollAnimationWrapperProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: viewport.margin || animationDefaults.viewport.margin
  });

  // Use preset if provided, otherwise use variants prop or default
  const combinedVariants = preset 
    ? animationVariants[preset] 
    : variants || animationVariants.fadeInUp;

  // Merge transition with delay
  const mergedTransition = {
    ...transition,
    delay
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : (fadeOut ? exit : initial)}
      variants={combinedVariants}
      transition={mergedTransition}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationWrapper;