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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-black/90 backdrop-blur-xl lg:hidden"
    >
      <div className="shell flex items-center justify-between gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="label-tech">Preço</p>
          <p className="truncate font-heading text-xl font-semibold leading-tight tnum">{formatPrice(vehicle.price)}</p>
        </div>
        <a
          href={generateWhatsAppLink(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-sm bg-red px-5 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-glow transition-colors active:bg-red-dark"
        >
          <WhatsAppIcon className="size-[18px]" />
          Quero este carro
        </a>
      </div>
    </motion.div>
  );
}
