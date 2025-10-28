'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { animationVariants, animationTransitions } from '@/lib/animationPresets';

interface StaggeredAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  initial?: string;
  animate?: string;
  transition?: any;
  viewport?: any;
  delay?: number;
  once?: boolean;
  staggerDelay?: number;
  style?: React.CSSProperties;
}

const StaggeredAnimationWrapper = ({
  children,
  className = '',
  variants = animationVariants.staggerContainer,
  initial = 'hidden',
  animate = 'visible',
  transition = animationTransitions.default,
  viewport = { once: true, margin: '-100px' },
  delay = 0,
  once = true,
  staggerDelay = 0.1,
  style,
  ...props
}: StaggeredAnimationWrapperProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: viewport.margin
  });

  // Modify the variants to include stagger delay
  const modifiedVariants = {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...variants.visible?.transition,
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      variants={modifiedVariants}
      transition={{
        ...transition,
        delay
      }}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default StaggeredAnimationWrapper;