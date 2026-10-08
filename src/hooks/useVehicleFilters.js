import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { DEFAULT_SORT, EMPTY_FILTERS, SORT_OPTIONS, countActiveFilters } from '@/utils/vehicleUtils';

/*
 * Filtros sincronizados com a URL — dá para compartilhar uma busca e o
 * botão "voltar" preserva o estado. Ex.:
 * /estoque?marca=Porsche,BMW&carroceria=SUV&preco-max=750000&ordem=menor-preco
 */
const PARAMS = {
  q: 'busca',
  brands: 'marca',
  model: 'modelo',
  yearMin: 'ano-min',
  yearMax: 'ano-max',
  priceMin: 'preco-min',
  priceMax: 'preco-max',
  transmissions: 'cambio',
  fuels: 'combustivel',
  categories: 'carroceria',
};
const LIST_KEYS = ['brands', 'transmissions', 'fuels', 'categories'];
const NUMBER_KEYS = ['yearMin', 'yearMax', 'priceMin', 'priceMax'];
// Filtros não criam entradas no histórico nem levam a página ao topo
const NAVIGATE_OPTS = { replace: true, preventScrollReset: true };

function parseFilters(params) {
  const f = { ...EMPTY_FILTERS };
  for (const [key, param] of Object.entries(PARAMS)) {
    const raw = params.get(param);
    if (!raw) continue;
    if (LIST_KEYS.includes(key)) f[key] = raw.split(',').filter(Boolean);
    else if (NUMBER_KEYS.includes(key)) f[key] = Number(raw) || null;
    else f[key] = raw;
  }
  return f;
}

function writeFilters(params, filters) {
  const next = new URLSearchParams(params);
  for (const [key, param] of Object.entries(PARAMS)) {
    const value = filters[key];
    const empty = value === null || value === '' || (Array.isArray(value) && !value.length);
    if (empty) next.delete(param);
    else next.set(param, Array.isArray(value) ? value.join(',') : String(value));
  }
  return next;
}

export function useVehicleFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(params), [params]);
  const sortParam = params.get('ordem');
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam : DEFAULT_SORT;

  const setFilters = useCallback(
    (patch) => setParams((prev) => writeFilters(prev, { ...parseFilters(prev), ...patch }), NAVIGATE_OPTS),
    [setParams],
  );

  const toggleValue = useCallback(
    (key, value) =>
      setParams((prev) => {
        const current = parseFilters(prev);
        const list = current[key].includes(value)
          ? current[key].filter((v) => v !== value)
          : [...current[key], value];
        const patch = { [key]: list };
        // Modelo deixa de fazer sentido se a marca dele saiu da seleção
        if (key === 'brands') patch.model = '';
        return writeFilters(prev, { ...current, ...patch });
      }, NAVIGATE_OPTS),
    [setParams],
  );

  const setSort = useCallback(
    (value) =>
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === DEFAULT_SORT) next.delete('ordem');
        else next.set('ordem', value);
        return next;
      }, NAVIGATE_OPTS),
    [setParams],
  );

  const clearFilters = useCallback(
    () => setParams((prev) => writeFilters(prev, { ...EMPTY_FILTERS, q: parseFilters(prev).q }), NAVIGATE_OPTS),
    [setParams],
  );

  return {
    filters,
    sort,
    setFilters,
    toggleValue,
    setSort,
    clearFilters,
    activeCount: countActiveFilters(filters),
  };
}

/** Monta a URL do estoque com filtros pré-aplicados (links de categoria, busca…). */
export function buildCatalogUrl(patch = {}) {
  const params = writeFilters(new URLSearchParams(), { ...EMPTY_FILTERS, ...patch });
  const qs = params.toString();
  return `/estoque${qs ? `?${qs}` : ''}`;
}
