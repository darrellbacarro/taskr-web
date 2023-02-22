'use client';

import { motion } from 'framer-motion';
import { FC } from 'react';

type AnimatedContainerProps = {
  children: React.ReactNode;
  className?: React.ComponentProps<'div'>['className'];
};

const AnimatedContainer: FC<AnimatedContainerProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;
