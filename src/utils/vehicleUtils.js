/* ==========================================================================
   Funções de domínio dos veículos: formatação, slug, imagens, busca,
   filtros, ordenação e recomendações. Sem dependência de React.
   ========================================================================== */

const currencyBRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const integerBR = new Intl.NumberFormat('pt-BR');

export const formatPrice = (value) => currencyBRL.format(value);

/** "R$ 239 mil" / "R$ 1,1 mi" — para filtros e telemetria. */
export function formatPriceShort(value) {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  }
  return `R$ ${Math.round(value / 1000)} mil`;
}

export const formatMileage = (km) => `${integerBR.format(km)} km`;

export const formatNumber = (n) => integerBR.format(n);

/** "01", "02"… — numeração técnica. */
export const pad2 = (n) => String(n).padStart(2, '0');

/* ---------- Nome, slug e URL ---------- */

export const getVehicleName = (v) => [v.model, v.version].filter(Boolean).join(' ');

export const getVehicleFullName = (v) => `${v.brand} ${getVehicleName(v)}`;

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export const slugify = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getVehicleSlug = (v) => v.slug ?? slugify(`${getVehicleFullName(v)} ${v.year}`);

export const getVehicleUrl = (v) => `/veiculos/${getVehicleSlug(v)}`;

export const findVehicle = (list, slugOrId) =>
  list.find((v) => getVehicleSlug(v) === slugOrId || String(v.id) === String(slugOrId));

/* ---------- Imagens ---------- */

/** Capa do card: `image` ou a primeira foto da galeria. `null` = placeholder. */
export const getVehicleCover = (v) => v.image ?? v.images?.[0] ?? null;

/** Galeria completa. Array vazio = placeholder. */
export function getVehicleImages(v) {
  if (v.images?.length) return v.images;
  return v.image ? [v.image] : [];
}

export const getVehicleImageAlt = (v, index = 0) =>
  `${getVehicleFullName(v)} ${v.year}${index ? ` — foto ${index + 1}` : ''}`;

/* ---------- Busca ---------- */

function getSearchHaystack(v) {
  return normalizeText(
    [v.brand, v.model, v.version, v.category, v.fuel, v.transmission, v.year, v.specs?.color].join(' '),
  );
}

/** Todos os termos digitados precisam aparecer (ordem livre, sem acento). */
export function matchesSearch(v, query) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = getSearchHaystack(v);
  return terms.every((term) => haystack.includes(term));
}

/* ---------- Filtros ---------- */

export const EMPTY_FILTERS = {
  q: '',
  brands: [],
  model: '',
  yearMin: null,
  yearMax: null,
  priceMin: null,
  priceMax: null,
  transmissions: [],
  fuels: [],
  categories: [],
};

export const PRICE_STEPS = [150000, 250000, 350000, 500000, 750000, 1000000, 1500000];

export function filterVehicles(list, f) {
  return list.filter((v) => {
    if (f.q && !matchesSearch(v, f.q)) return false;
    if (f.brands.length && !f.brands.includes(v.brand)) return false;
    if (f.model && v.model !== f.model) return false;
    if (f.yearMin && v.year < f.yearMin) return false;
    if (f.yearMax && v.year > f.yearMax) return false;
    if (f.priceMin && v.price < f.priceMin) return false;
    if (f.priceMax && v.price > f.priceMax) return false;
    if (f.transmissions.length && !f.transmissions.includes(v.transmission)) return false;
    if (f.fuels.length && !f.fuels.includes(v.fuel)) return false;
    if (f.categories.length && !f.categories.includes(v.category)) return false;
    return true;
  });
}

export function countActiveFilters(f) {
  return (
    f.brands.length +
    (f.model ? 1 : 0) +
    (f.yearMin || f.yearMax ? 1 : 0) +
    (f.priceMin || f.priceMax ? 1 : 0) +
    f.transmissions.length +
    f.fuels.length +
    f.categories.length
  );
}

function countBy(list, key) {
  const map = new Map();
  for (const v of list) map.set(v[key], (map.get(v[key]) ?? 0) + 1);
  return [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value, 'pt-BR'));
}

/** Opções disponíveis para cada filtro, derivadas do estoque. */
export function getFilterOptions(list) {
  const years = [...new Set(list.map((v) => v.year))].sort((a, b) => b - a);
  const prices = list.map((v) => v.price);
  return {
    brands: countBy(list, 'brand'),
    models: countBy(list, 'model').map((m) => ({
      ...m,
      brand: list.find((v) => v.model === m.value)?.brand,
    })),
    years,
    transmissions: countBy(list, 'transmission'),
    fuels: countBy(list, 'fuel'),
    categories: countBy(list, 'category'),
    priceRange: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
  };
}

/* ---------- Ordenação ---------- */

export const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'ano', label: 'Ano (mais novo)' },
  { value: 'destaques', label: 'Destaques' },
];

export const DEFAULT_SORT = 'recentes';

export function sortVehicles(list, sort = DEFAULT_SORT) {
  const sorted = [...list];
  const byDate = (a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '');
  switch (sort) {
    case 'menor-preco':
      return sorted.sort((a, b) => a.price - b.price);
    case 'maior-preco':
      return sorted.sort((a, b) => b.price - a.price);
    case 'ano':
      return sorted.sort((a, b) => b.year - a.year || byDate(a, b));
    case 'destaques':
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || byDate(a, b));
    default:
      return sorted.sort(byDate);
  }
}

/* ---------- Recomendações ---------- */

export function getSimilarVehicles(vehicle, list, limit = 3) {
  return list
    .filter((v) => v.id !== vehicle.id)
    .map((v) => {
      let score = 0;
      if (v.category === vehicle.category) score += 3;
      if (v.brand === vehicle.brand) score += 2;
      if (Math.abs(v.price - vehicle.price) / vehicle.price < 0.35) score += 1;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score || b.v.price - a.v.price)
    .slice(0, limit)
    .map(({ v }) => v);
}

export const getFeaturedVehicles = (list) => sortVehicles(list.filter((v) => v.featured), 'recentes');

/** Rótulos das especificações exibidas na página de detalhes. */
export function getVehicleSpecList(v) {
  const s = v.specs ?? {};
  return [
    { label: 'Motor', value: s.engine },
    { label: 'Potência', value: s.power },
    { label: 'Torque', value: s.torque },
    { label: '0–100 km/h', value: s.acceleration },
    { label: 'Tração', value: s.traction },
    { label: 'Câmbio', value: v.transmission },
    { label: 'Combustível', value: v.fuel },
    { label: 'Carroceria', value: v.category },
    { label: 'Portas', value: s.doors },
    { label: 'Cor', value: s.color },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== '');
}
