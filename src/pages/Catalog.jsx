import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import SlashMark from '@/components/ui/SlashMark';
import SearchBar from '@/components/vehicles/SearchBar';
import SortSelect from '@/components/vehicles/SortSelect';
import VehicleFilters from '@/components/vehicles/VehicleFilters';
import ActiveFilters from '@/components/vehicles/ActiveFilters';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import EmptyState from '@/components/vehicles/EmptyState';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleFilters } from '@/hooks/useVehicleFilters';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { EMPTY_FILTERS, filterVehicles, getFilterOptions, pad2, sortVehicles } from '@/utils/vehicleUtils';

export default function Catalog() {
  useDocumentMeta({
    title: 'Estoque de veículos',
    description:
      'Confira o estoque da Zezinho Automóveis: filtre por marca, modelo, ano, preço, câmbio, combustível e carroceria.',
    path: '/estoque',
  });

  const { vehicles, isLoading } = useVehicles();
  const { filters, sort, setFilters, toggleValue, setSort, clearFilters, activeCount } = useVehicleFilters();
  const [sheetOpen, setSheetOpen] = useState(false);

  const options = useMemo(() => getFilterOptions(vehicles), [vehicles]);
  const results = useMemo(() => sortVehicles(filterVehicles(vehicles, filters), sort), [vehicles, filters, sort]);
  const filtered = activeCount > 0 || Boolean(filters.q);

  // Uma única atualização da URL: limpa filtros e busca juntos
  const clearAll = () => setFilters(EMPTY_FILTERS);

  const filterProps = { options, filters, onToggle: toggleValue, onChange: setFilters };

  return (
    <>
      <PageTransition>
        {/* Cabeçalho */}
        <section aria-labelledby="estoque-titulo" className="relative overflow-hidden border-b border-line">
          <div aria-hidden="true" className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <SlashMark className="pointer-events-none absolute -right-10 -top-6 h-[140%] text-white/[0.025]" />
          <div className="shell relative flex flex-col gap-6 pb-8 pt-8 sm:flex-row sm:items-end sm:justify-between lg:pb-12 lg:pt-14">
            <div>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="size-2 bg-red" />
                <span className="label-tech">Showroom digital</span>
              </div>
              <h1 id="estoque-titulo" className="display mt-4 text-[clamp(4.5rem,22vw,11rem)]">
                Estoque
              </h1>
            </div>
            <p className="flex items-end gap-3 sm:flex-col sm:items-end sm:gap-1" aria-live="polite">
              <span className="display text-6xl tnum text-white sm:text-7xl">
                {isLoading ? '--' : pad2(filtered ? results.length : vehicles.length)}
              </span>
              <span className="label-tech pb-2 sm:pb-0">
                {filtered ? `de ${vehicles.length} veículos` : 'veículos disponíveis'}
              </span>
            </p>
          </div>
        </section>

        {/* Barra de ferramentas — fixa no topo no mobile */}
        <div className="sticky top-16 z-30 border-b border-line bg-black/90 backdrop-blur-xl lg:static lg:border-b-0 lg:bg-transparent lg:backdrop-blur-none">
          <div className="shell flex flex-col gap-3 py-3 lg:pt-8 lg:pb-0">
            <SearchBar value={filters.q} onChange={(q) => setFilters({ q })} />
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
                aria-controls="filtros"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-line-strong bg-graphite px-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white/30"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtros
                {activeCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-xs bg-red px-1 text-[11px] tnum">
                    {activeCount}
                  </span>
                )}
              </button>
              <SortSelect value={sort} onChange={setSort} hideLabel />
            </div>
          </div>
        </div>

        <div className="shell grid gap-8 pb-section pt-6 lg:grid-cols-[17rem_1fr] lg:gap-10 lg:pt-8 xl:grid-cols-[18rem_1fr]">
          {/* Sidebar de filtros (desktop) */}
          <aside aria-label="Filtros" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pr-2 scrollbar-none">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.16em]">Filtros</h2>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-gray underline decoration-line-strong underline-offset-4 hover:text-white"
                  >
                    Limpar ({activeCount})
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="space-y-4 py-5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-surface h-16 rounded-sm" />
                  ))}
                </div>
              ) : (
                <VehicleFilters {...filterProps} idPrefix="sidebar" />
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="label-tech" aria-live="polite">
                {isLoading
                  ? 'Carregando estoque…'
                  : `${results.length} ${results.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}`}
              </p>
              <div className="hidden w-56 lg:block">
                <SortSelect value={sort} onChange={setSort} hideLabel />
              </div>
            </div>
            {(activeCount > 0 || filters.q) && (
              <div className="mb-6">
                <ActiveFilters
                  filters={filters}
                  onToggle={toggleValue}
                  onChange={setFilters}
                  onClear={clearAll}
                />
              </div>
            )}

            {!isLoading && !results.length ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <VehicleGrid vehicles={results} isLoading={isLoading} layout="catalog" label="Resultados do estoque" />
            )}
          </div>
        </div>
      </PageTransition>

      {/* Filtros no mobile: bottom sheet */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        id="filtros"
        title="Filtros"
        subtitle={activeCount ? `${activeCount} ${activeCount === 1 ? 'filtro ativo' : 'filtros ativos'}` : 'Refine sua busca'}
        footer={
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <Button variant="secondary" icon={null} onClick={clearFilters} disabled={!activeCount}>
              Limpar
            </Button>
            <Button onClick={() => setSheetOpen(false)} fullWidth>
              {results.length ? `Ver ${results.length} ${results.length === 1 ? 'veículo' : 'veículos'}` : 'Nenhum resultado'}
            </Button>
          </div>
        }
      >
        <VehicleFilters {...filterProps} idPrefix="sheet" />
      </BottomSheet>
    </>
  );
}
