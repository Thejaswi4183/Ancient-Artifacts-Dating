'use client';
import { motion } from 'framer-motion';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="page-wrapper"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.8, 0.25, 1], // smooth cubic bezier
      }}
    >
      {children}
    </motion.main>
  );
}
