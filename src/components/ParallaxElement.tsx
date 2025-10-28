'use client';

import { motion, useInView, useTransform, useScroll } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // Speed of parallax effect (negative values move opposite to scroll)
  style?: React.CSSProperties;
}

const ParallaxElement = ({
  children,
  className = '',
  speed = -0.5,
  style,
  ...props
}: ParallaxElementProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: yTransform,
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxElement;