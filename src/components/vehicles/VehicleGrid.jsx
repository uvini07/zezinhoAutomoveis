import { AnimatePresence, motion } from 'framer-motion';
import VehicleCard from '@/components/vehicles/VehicleCard';
import SkeletonVehicleCard from '@/components/vehicles/SkeletonVehicleCard';
import { cn } from '@/utils/cn';

const LAYOUTS = {
  // Estoque com sidebar de filtros no desktop
  catalog: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
  // Largura total (relacionados, etc.)
  full: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/** Grid responsivo: 1 coluna (mobile) · 2 (tablet) · 3 (desktop). Stagger na entrada. */
export default function VehicleGrid({ vehicles, isLoading, layout = 'full', skeletonCount = 6, label }) {
  const gridClass = cn('grid gap-4 sm:gap-5', LAYOUTS[layout]);

  if (isLoading) {
    return (
      <ul className={gridClass} aria-busy="true" aria-label="Carregando veículos">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <li key={i}>
            <SkeletonVehicleCard />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul className={gridClass} variants={container} initial="hidden" animate="show" aria-label={label}>
      <AnimatePresence mode="popLayout" initial={false}>
        {vehicles.map((vehicle, i) => (
          <motion.li
            key={vehicle.id}
            layout
            variants={item}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
          >
            <VehicleCard vehicle={vehicle} index={i + 1} priority={i < 2} />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
