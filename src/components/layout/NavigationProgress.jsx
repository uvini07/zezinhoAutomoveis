import { useNavigation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';

/** Barra vermelha no topo enquanto uma página (code-split) carrega. */
export default function NavigationProgress() {
  const navigation = useNavigation();
  const loading = navigation.state !== 'idle';

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-red shadow-glow"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.85, transition: { duration: 1.6, ease: 'easeOut' } }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.3 } }}
        />
      )}
    </AnimatePresence>
  );
}
