import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useVehicles } from '@/hooks/useVehicles';
import { buildCatalogUrl } from '@/hooks/useVehicleFilters';
import { getFilterOptions, pad2 } from '@/utils/vehicleUtils';
import { cn } from '@/utils/cn';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/** Atalhos por carroceria — levam ao estoque já filtrado. */
export default function CategoryShowcase() {
  const { vehicles, isLoading } = useVehicles();
  const categories = getFilterOptions(vehicles).categories.sort((a, b) => b.count - a.count);
  const oddCount = categories.length % 2 === 1;

  return (
    <section aria-labelledby="carrocerias-titulo" className="border-t border-line py-section">
      <div className="shell">
        <SectionHeader
          id="carrocerias-titulo"
          index="03"
          eyebrow="Carrocerias"
          title="Escolha pelo estilo."
          description="Do esportivo de duas portas à picape — encontre o formato que combina com a sua rotina."
        />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-surface h-36 rounded-md sm:h-44" />
            ))}
          </div>
        ) : (
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5"
          >
            {categories.map((category, i) => (
              <motion.li
                key={category.value}
                variants={item}
                className={cn(oddCount && i === categories.length - 1 && 'col-span-2 md:col-span-1')}
              >
                <Link
                  to={buildCatalogUrl({ categories: [category.value] })}
                  className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-md border border-line bg-graphite p-4 transition-[border-color,transform] duration-500 ease-race hover:-translate-y-1 hover:border-red/60 sm:h-44 sm:p-5"
                >
                  <span aria-hidden="true" className="absolute inset-0 bg-hatch opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span
                    aria-hidden="true"
                    className="absolute -right-10 top-0 h-[140%] w-10 origin-top rotate-45 bg-red/0 transition-colors duration-500 group-hover:bg-red/90"
                  />
                  <span className="relative flex items-start justify-between">
                    <span className="font-heading text-[11px] font-semibold tnum text-gray">{pad2(i + 1)}</span>
                    <ArrowUpRight
                      className="size-5 text-gray transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="relative">
                    <span className="display block text-[2.6rem] text-white sm:text-5xl">{category.value}</span>
                    <span className="label-tech mt-1 block">
                      {category.count} {category.count === 1 ? 'veículo' : 'veículos'}
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
