import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/** Loading com a assinatura diagonal da marca. */
export default function Loader({ label = 'Carregando', className }) {
  return (
    <div role="status" className={cn('flex flex-col items-center gap-4', className)}>
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-6 w-1.5 -skew-x-[32deg] bg-red"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <span className="label-tech">{label}</span>
    </div>
  );
}
