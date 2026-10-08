import { motion } from 'framer-motion';

/** Page reveal: opacity 0 → 1, y 20 → 0. */
export default function PageTransition({ className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
