import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import VehicleCard from '@/components/vehicles/VehicleCard';
import SkeletonVehicleCard from '@/components/vehicles/SkeletonVehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import { cn } from '@/utils/cn';
import { getFeaturedVehicles, pad2 } from '@/utils/vehicleUtils';

const slideClass = 'min-w-0 flex-[0_0_86%] pl-4 sm:flex-[0_0_50%] sm:pl-5 lg:flex-[0_0_33.3333%]';

/** Destaques em carrossel (Embla) — sem autoplay, controle total do usuário. */
export default function FeaturedCarousel() {
  const { vehicles, isLoading } = useVehicles();
  const featured = getFeaturedVehicles(vehicles);
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [state, setState] = useState({ index: 0, snaps: 1, canPrev: false, canNext: false, progress: 0 });

  const sync = useCallback((api) => {
    setState({
      index: api.selectedScrollSnap(),
      snaps: api.scrollSnapList().length,
      canPrev: api.canScrollPrev(),
      canNext: api.canScrollNext(),
      progress: Math.max(0, Math.min(1, api.scrollProgress())),
    });
  }, []);

  useEffect(() => {
    if (!embla) return undefined;
    sync(embla);
    embla.on('select', sync).on('reInit', sync).on('scroll', sync);
    return () => {
      embla.off('select', sync).off('reInit', sync).off('scroll', sync);
    };
  }, [embla, sync]);

  const arrowClass =
    'grid size-12 place-items-center rounded-sm border border-line-strong text-white transition-colors hover:border-red hover:bg-red disabled:pointer-events-none disabled:opacity-30';

  return (
    <section id="destaques" aria-labelledby="destaques-titulo" className="scroll-mt-16 py-section">
      <div className="shell">
        <SectionHeader
          id="destaques-titulo"
          index="02"
          eyebrow="Destaques"
          title={
            <>
              Carros selecionados
              <br />
              <span className="text-gray">para quem gosta de dirigir.</span>
            </>
          }
          action={
            <div className="hidden items-center gap-2 md:flex">
              <button type="button" className={arrowClass} onClick={() => embla?.scrollPrev()} disabled={!state.canPrev} aria-label="Destaques anteriores">
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button type="button" className={arrowClass} onClick={() => embla?.scrollNext()} disabled={!state.canNext} aria-label="Próximos destaques">
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          }
        />

        <Reveal className="mt-10 lg:mt-14">
          <div ref={emblaRef} className="overflow-hidden" aria-roledescription="carrossel" aria-label="Veículos em destaque">
            <ul className="-ml-4 flex touch-pan-y sm:-ml-5">
              {isLoading
                ? [0, 1, 2].map((i) => (
                    <li key={i} className={slideClass}>
                      <SkeletonVehicleCard />
                    </li>
                  ))
                : featured.map((vehicle, i) => (
                    <li key={vehicle.id} className={slideClass}>
                      <VehicleCard vehicle={vehicle} index={i + 1} />
                    </li>
                  ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-4 sm:gap-6">
            <span className="font-heading text-xs font-semibold tnum text-white">
              {pad2(state.index + 1)} <span className="text-gray-dim">/ {pad2(state.snaps)}</span>
            </span>
            <div aria-hidden="true" className="relative h-px flex-1 bg-line-strong">
              <span
                className={cn('absolute -top-px left-0 h-[3px] bg-red')}
                style={{ width: `${Math.max(8, state.progress * 100)}%` }}
              />
            </div>
            <Link
              to="/estoque"
              className="group inline-flex min-h-11 items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-white"
            >
              Ver estoque completo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
