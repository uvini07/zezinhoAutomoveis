import { motion } from 'framer-motion';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { formatPrice } from '@/utils/vehicleUtils';

/** Barra fixa no mobile da página do veículo: preço + "Quero este carro". */
export default function StickyVehicleCTA({ vehicle }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300, delay: 0.4 }}
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
    >
      <div className="glass flex items-center justify-between gap-3 rounded-full py-1.5 pl-5 pr-1.5">
        <div className="min-w-0">
          <p className="label-tech">Preço</p>
          <p className="truncate font-heading text-lg font-semibold leading-tight tnum">{formatPrice(vehicle.price)}</p>
        </div>
        <a
          href={generateWhatsAppLink(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-red px-5 text-sm font-medium text-white shadow-glow transition-colors active:bg-red-dark"
        >
          <WhatsAppIcon className="size-[18px]" />
          Quero este carro
        </a>
      </div>
    </motion.div>
  );
}
