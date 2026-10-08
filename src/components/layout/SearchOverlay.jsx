import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import SkeletonVehicleImage from '@/components/vehicles/SkeletonVehicleImage';
import VehicleImage from '@/components/vehicles/VehicleImage';
import { useUI } from '@/context/UIContext';
import { useDialog } from '@/hooks/useDialog';
import { useVehicles } from '@/hooks/useVehicles';
import { buildCatalogUrl } from '@/hooks/useVehicleFilters';
import {
  formatMileage,
  formatPrice,
  getFilterOptions,
  getVehicleCover,
  getVehicleImageAlt,
  getVehicleName,
  getVehicleUrl,
  matchesSearch,
} from '@/utils/vehicleUtils';

const MAX_RESULTS = 5;

/** Busca rápida (modal scale + opacity). Resultados instantâneos enquanto digita. */
export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();

  return (
    <AnimatePresence>
      {searchOpen && <SearchPanel onClose={closeSearch} />}
    </AnimatePresence>
  );
}

function SearchPanel({ onClose }) {
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicles();
  const [query, setQuery] = useState('');
  const ref = useDialog(true, onClose, { initialFocus: 'input' });

  const matches = useMemo(
    () => (query.trim() ? vehicles.filter((v) => matchesSearch(v, query)) : []),
    [vehicles, query],
  );
  const options = useMemo(() => getFilterOptions(vehicles), [vehicles]);

  function go(url) {
    onClose();
    navigate(url);
  }

  function handleSubmit(event) {
    event.preventDefault();
    go(buildCatalogUrl({ q: query.trim() }));
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar veículos"
        className="relative flex h-full flex-col overflow-hidden bg-black-2 sm:mx-auto sm:mt-[9vh] sm:h-auto sm:max-h-[80vh] sm:max-w-2xl sm:rounded-md sm:border sm:border-line-strong sm:shadow-deep"
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -4 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <span aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-24 bg-red" />
        <form role="search" onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-b border-line px-3 py-3 sm:px-4">
          <Search className="ml-1 size-5 shrink-0 text-gray" aria-hidden="true" />
          <label htmlFor="busca-rapida" className="sr-only">
            Buscar por marca, modelo ou versão
          </label>
          <input
            id="busca-rapida"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Marca, modelo, versão…"
            className="h-12 min-w-0 flex-1 bg-transparent text-lg text-white placeholder:text-gray-dim focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-sm border border-line-strong text-white transition-colors hover:border-white/40"
            aria-label="Fechar busca"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {!query.trim() ? (
            <div className="space-y-7">
              <SuggestionGroup
                title="Carrocerias"
                items={options.categories}
                onPick={(value) => go(buildCatalogUrl({ categories: [value] }))}
              />
              <SuggestionGroup
                title="Marcas"
                items={options.brands}
                onPick={(value) => go(buildCatalogUrl({ brands: [value] }))}
              />
            </div>
          ) : isLoading ? (
            <p className="label-tech py-6 text-center">Carregando estoque…</p>
          ) : matches.length ? (
            <div>
              <p className="label-tech mb-3" aria-live="polite">
                {matches.length} {matches.length === 1 ? 'resultado' : 'resultados'}
              </p>
              <ul className="divide-y divide-line">
                {matches.slice(0, MAX_RESULTS).map((v) => (
                  <li key={v.id}>
                    <Link
                      to={getVehicleUrl(v)}
                      onClick={onClose}
                      className="group flex items-center gap-4 rounded-xs py-3 transition-colors"
                    >
                      <span className="relative aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-xs">
                        {getVehicleCover(v) ? (
                          <VehicleImage src={getVehicleCover(v)} alt={getVehicleImageAlt(v)} />
                        ) : (
                          <SkeletonVehicleImage compact />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="label-tech block">{v.brand}</span>
                        <span className="block truncate font-heading font-semibold text-white group-hover:underline">
                          {getVehicleName(v)}
                        </span>
                        <span className="block text-xs text-gray tnum">
                          {v.year} · {formatMileage(v.mileage)}
                          <span className="text-white sm:hidden"> · {formatPrice(v.price)}</span>
                        </span>
                      </span>
                      <span className="hidden font-heading text-sm font-semibold tnum text-white sm:block">
                        {formatPrice(v.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleSubmit}
                className="group mt-4 flex h-12 w-full items-center justify-between rounded-sm border border-line-strong px-4 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-red hover:bg-red"
              >
                Ver todos os resultados no estoque
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <p className="py-8 text-center text-gray" aria-live="polite">
              Nenhum veículo encontrado para “{query}”.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SuggestionGroup({ title, items, onPick }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="label-tech mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onPick(item.value)}
            className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-line-strong px-3 text-[13px] text-gray transition-colors hover:border-white/35 hover:text-white"
          >
            {item.value}
            <span className="text-[11px] tnum text-gray-dim">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
