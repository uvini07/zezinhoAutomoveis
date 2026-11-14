import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import SelectField from '@/components/ui/SelectField';
import { buildCatalogUrl } from '@/hooks/useVehicleFilters';
import { useVehicles } from '@/hooks/useVehicles';
import { EMPTY_FILTERS, PRICE_STEPS, filterVehicles, formatPriceShort, getFilterOptions } from '@/utils/vehicleUtils';

const EMPTY = { brand: '', model: '', yearMin: '', yearMax: '', priceMin: '', priceMax: '' };
const num = (v) => (v ? Number(v) : null);

/**
 * Faixa de busca rápida: marca, modelo, ano e preço. Leva ao estoque com
 * os filtros aplicados; o botão já mostra quantos carros atendem à busca.
 */
export default function QuickSearch() {
  const navigate = useNavigate();
  const { vehicles, isLoading } = useVehicles();
  const [form, setForm] = useState(EMPTY);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const options = useMemo(() => getFilterOptions(vehicles), [vehicles]);
  const models = form.brand ? options.models.filter((m) => m.brand === form.brand) : options.models;
  const yearsAsc = [...options.years].reverse();

  const filters = {
    ...EMPTY_FILTERS,
    brands: form.brand ? [form.brand] : [],
    model: form.model,
    yearMin: num(form.yearMin),
    yearMax: num(form.yearMax),
    priceMin: num(form.priceMin),
    priceMax: num(form.priceMax),
  };
  const count = useMemo(() => filterVehicles(vehicles, filters).length, [vehicles, form]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(event) {
    event.preventDefault();
    navigate(buildCatalogUrl(filters));
  }

  const field = 'min-w-0';
  const select = 'h-12 text-[15px]';

  return (
    <form
      role="search"
      aria-label="Buscar carro no estoque"
      onSubmit={onSubmit}
      className="glass grid grid-cols-2 gap-2.5 rounded-[2rem] p-3 sm:p-4 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_1fr_auto] lg:rounded-full lg:p-2.5"
    >
      <SelectField
        label="Marca"
        hideLabel
        className={field}
        selectClassName={select}
        value={form.brand}
        disabled={isLoading}
        onChange={(e) => set({ brand: e.target.value, model: '' })}
      >
        <option value="">Marca</option>
        {options.brands.map((b) => (
          <option key={b.value} value={b.value}>
            {b.value}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Modelo"
        hideLabel
        className={field}
        selectClassName={select}
        value={form.model}
        disabled={isLoading}
        onChange={(e) => {
          const model = e.target.value;
          const brand = options.models.find((m) => m.value === model)?.brand ?? form.brand;
          set({ model, brand: model ? brand : form.brand });
        }}
      >
        <option value="">Modelo</option>
        {models.map((m) => (
          <option key={m.value} value={m.value}>
            {form.brand ? m.value : `${m.brand} ${m.value}`}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Ano a partir de"
        hideLabel
        className={field}
        selectClassName={select}
        value={form.yearMin}
        disabled={isLoading}
        onChange={(e) => set({ yearMin: e.target.value })}
      >
        <option value="">Ano de</option>
        {yearsAsc.map((y) => (
          <option key={y} value={y} disabled={form.yearMax && y > Number(form.yearMax)}>
            {y}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Ano até"
        hideLabel
        className={field}
        selectClassName={select}
        value={form.yearMax}
        disabled={isLoading}
        onChange={(e) => set({ yearMax: e.target.value })}
      >
        <option value="">Até</option>
        {options.years.map((y) => (
          <option key={y} value={y} disabled={form.yearMin && y < Number(form.yearMin)}>
            {y}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Preço a partir de"
        hideLabel
        className={field}
        selectClassName={select}
        value={form.priceMin}
        onChange={(e) => set({ priceMin: e.target.value })}
      >
        <option value="">Preço de</option>
        {PRICE_STEPS.map((p) => (
          <option key={p} value={p} disabled={form.priceMax && p >= Number(form.priceMax)}>
            {formatPriceShort(p)}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Preço até"
        hideLabel
        className={field}
        selectClassName={select}
        value={form.priceMax}
        onChange={(e) => set({ priceMax: e.target.value })}
      >
        <option value="">Até</option>
        {PRICE_STEPS.map((p) => (
          <option key={p} value={p} disabled={form.priceMin && p <= Number(form.priceMin)}>
            {formatPriceShort(p)}
          </option>
        ))}
      </SelectField>

      <button
        type="submit"
        disabled={isLoading || count === 0}
        className="col-span-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-red px-6 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-[background-color,box-shadow] hover:bg-red-bright hover:shadow-glow disabled:opacity-50 lg:col-span-1"
      >
        <Search className="size-4" aria-hidden="true" />
        <span aria-live="polite">
          {isLoading ? 'Buscar' : count === 0 ? 'Nenhum carro' : `Buscar ${count} ${count === 1 ? 'carro' : 'carros'}`}
        </span>
      </button>
    </form>
  );
}
