import { X } from 'lucide-react';
import { formatPriceShort } from '@/utils/vehicleUtils';

/** Lista os filtros aplicados como "pílulas" removíveis. */
export default function ActiveFilters({ filters, onToggle, onChange, onClear }) {
  const items = [
    ...filters.brands.map((v) => ({ key: `b-${v}`, label: v, remove: () => onToggle('brands', v) })),
    filters.model && { key: 'model', label: `Modelo: ${filters.model}`, remove: () => onChange({ model: '' }) },
    (filters.yearMin || filters.yearMax) && {
      key: 'year',
      label: `Ano: ${filters.yearMin ?? '…'}–${filters.yearMax ?? '…'}`,
      remove: () => onChange({ yearMin: null, yearMax: null }),
    },
    (filters.priceMin || filters.priceMax) && {
      key: 'price',
      label: `Preço: ${filters.priceMin ? formatPriceShort(filters.priceMin) : '…'} – ${
        filters.priceMax ? formatPriceShort(filters.priceMax) : '…'
      }`,
      remove: () => onChange({ priceMin: null, priceMax: null }),
    },
    ...filters.transmissions.map((v) => ({ key: `t-${v}`, label: v, remove: () => onToggle('transmissions', v) })),
    ...filters.fuels.map((v) => ({ key: `f-${v}`, label: v, remove: () => onToggle('fuels', v) })),
    ...filters.categories.map((v) => ({ key: `c-${v}`, label: v, remove: () => onToggle('categories', v) })),
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.remove}
          className="inline-flex h-8 items-center gap-1.5 rounded-xs border border-red/50 bg-red/10 pl-2.5 pr-1.5 text-xs text-white transition-colors hover:border-red hover:bg-red/20"
          aria-label={`Remover filtro ${item.label}`}
        >
          {item.label}
          <X className="size-3.5 text-gray" aria-hidden="true" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-1 h-8 px-1 text-xs font-medium text-gray underline decoration-line-strong underline-offset-4 transition-colors hover:text-white"
      >
        Limpar tudo
      </button>
    </div>
  );
}
