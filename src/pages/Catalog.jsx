import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import BottomSheet from '@/components/ui/BottomSheet';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/vehicles/SearchBar';
import SortSelect from '@/components/vehicles/SortSelect';
import VehicleFilters from '@/components/vehicles/VehicleFilters';
import ActiveFilters from '@/components/vehicles/ActiveFilters';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import EmptyState from '@/components/vehicles/EmptyState';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleFilters } from '@/hooks/useVehicleFilters';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { EMPTY_FILTERS, filterVehicles, getFilterOptions, sortVehicles } from '@/utils/vehicleUtils';

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
        <section aria-labelledby="estoque-titulo">
          <div className="shell flex items-end justify-between gap-6 pb-6 pt-6 lg:pb-8 lg:pt-12">
            <div>
              <h1 id="estoque-titulo" className="display text-[clamp(2.75rem,8vw,5rem)]">
                Estoque
              </h1>
              <p className="label-tech mt-2" aria-live="polite">
                {isLoading
                  ? 'Carregando…'
                  : filtered
                    ? `${results.length} de ${vehicles.length} veículos`
                    : `${vehicles.length} veículos disponíveis`}
              </p>
            </div>
          </div>
        </section>

        {/* Barra de ferramentas — fixa no topo no mobile */}
        <div className="sticky top-[4.75rem] z-30 lg:static">
          <div className="shell flex flex-col gap-3 py-2 lg:py-0">
            <SearchBar value={filters.q} onChange={(q) => setFilters({ q })} />
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                aria-haspopup="dialog"
                aria-controls="filtros"
                className="glass inline-flex h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-white"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Filtros
                {activeCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[11px] tnum">
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
            <div className="glass sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-3xl px-5 py-5 scrollbar-none">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h2 className="font-heading text-base font-semibold">Filtros</h2>
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
            <div className="mb-5 hidden lg:flex lg:items-center lg:justify-between">
              <span />
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
