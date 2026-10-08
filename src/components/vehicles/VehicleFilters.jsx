import Chip from '@/components/ui/Chip';
import SelectField from '@/components/ui/SelectField';
import { PRICE_STEPS, formatPriceShort } from '@/utils/vehicleUtils';

function FilterSection({ index, title, children }) {
  return (
    <fieldset className="min-w-0 border-b border-line py-5 last:border-b-0">
      <legend className="float-left mb-3 flex w-full items-center gap-2.5">
        <span className="font-heading text-[11px] font-semibold tnum text-white">{index}</span>
        <span aria-hidden="true" className="h-px w-4 bg-red" />
        <span className="label-tech">{title}</span>
      </legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function ChipGroup({ items, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip
          key={item.value}
          selected={selected.includes(item.value)}
          count={item.count}
          onClick={() => onToggle(item.value)}
        >
          {item.value}
        </Chip>
      ))}
    </div>
  );
}

const toNumber = (value) => (value ? Number(value) : null);

/**
 * Conteúdo dos filtros — o mesmo componente vive na sidebar (desktop)
 * e no bottom sheet (mobile).
 */
export default function VehicleFilters({ options, filters, onToggle, onChange, idPrefix = 'filtro' }) {
  const models = filters.brands.length
    ? options.models.filter((m) => filters.brands.includes(m.brand))
    : options.models;
  const yearsAsc = [...options.years].reverse();

  return (
    <div>
      <FilterSection index="01" title="Marca">
        <ChipGroup items={options.brands} selected={filters.brands} onToggle={(v) => onToggle('brands', v)} />
      </FilterSection>

      <FilterSection index="02" title="Modelo">
        <SelectField
          label="Modelo"
          hideLabel
          id={`${idPrefix}-modelo`}
          value={filters.model}
          onChange={(e) => onChange({ model: e.target.value })}
        >
          <option value="">Todos os modelos</option>
          {models.map((m) => (
            <option key={m.value} value={m.value}>
              {m.brand} {m.value} ({m.count})
            </option>
          ))}
        </SelectField>
      </FilterSection>

      <FilterSection index="03" title="Ano">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="De"
            value={filters.yearMin ?? ''}
            onChange={(e) => onChange({ yearMin: toNumber(e.target.value) })}
          >
            <option value="">Qualquer</option>
            {yearsAsc.map((y) => (
              <option key={y} value={y} disabled={filters.yearMax && y > filters.yearMax}>
                {y}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Até"
            value={filters.yearMax ?? ''}
            onChange={(e) => onChange({ yearMax: toNumber(e.target.value) })}
          >
            <option value="">Qualquer</option>
            {options.years.map((y) => (
              <option key={y} value={y} disabled={filters.yearMin && y < filters.yearMin}>
                {y}
              </option>
            ))}
          </SelectField>
        </div>
      </FilterSection>

      <FilterSection index="04" title="Preço">
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Mínimo"
            value={filters.priceMin ?? ''}
            onChange={(e) => onChange({ priceMin: toNumber(e.target.value) })}
          >
            <option value="">Qualquer</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p} disabled={filters.priceMax && p >= filters.priceMax}>
                {formatPriceShort(p)}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Máximo"
            value={filters.priceMax ?? ''}
            onChange={(e) => onChange({ priceMax: toNumber(e.target.value) })}
          >
            <option value="">Qualquer</option>
            {PRICE_STEPS.map((p) => (
              <option key={p} value={p} disabled={filters.priceMin && p <= filters.priceMin}>
                {formatPriceShort(p)}
              </option>
            ))}
          </SelectField>
        </div>
      </FilterSection>

      <FilterSection index="05" title="Câmbio">
        <ChipGroup
          items={options.transmissions}
          selected={filters.transmissions}
          onToggle={(v) => onToggle('transmissions', v)}
        />
      </FilterSection>

      <FilterSection index="06" title="Combustível">
        <ChipGroup items={options.fuels} selected={filters.fuels} onToggle={(v) => onToggle('fuels', v)} />
      </FilterSection>

      <FilterSection index="07" title="Carroceria">
        <ChipGroup
          items={options.categories}
          selected={filters.categories}
          onToggle={(v) => onToggle('categories', v)}
        />
      </FilterSection>
    </div>
  );
}
