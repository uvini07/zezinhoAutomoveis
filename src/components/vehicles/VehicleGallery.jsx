import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleImage from '@/components/vehicles/VehicleImage';
import { VEHICLE_PLACEHOLDER_IMAGE } from '@/config/site';
import { cn } from '@/utils/cn';
import { getVehicleFullName, getVehicleImageAlt, getVehicleImages, pad2 } from '@/utils/vehicleUtils';

const frame = 'relative overflow-hidden border-line bg-skeleton-1 sm:rounded-md sm:border';

/**
 * Galeria do veículo (Embla): arraste no celular, setas no desktop,
 * miniaturas e contador. Sem fotos → banner "Veículo em preparação".
 */
export default function VehicleGallery({ vehicle }) {
  const images = getVehicleImages(vehicle);
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return undefined;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on('select', onSelect).on('reInit', onSelect);
    return () => {
      embla.off('select', onSelect).off('reInit', onSelect);
    };
  }, [embla]);

  const scrollTo = useCallback((i) => embla?.scrollTo(i), [embla]);

  if (!images.length) {
    return (
      <figure className={cn(frame, 'aspect-[4/3]')}>
        <img
          src={VEHICLE_PLACEHOLDER_IMAGE}
          alt={`${getVehicleFullName(vehicle)} — veículo em preparação, fotos em breve`}
          width="1024"
          height="768"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-linear-to-t from-black/85 to-transparent px-4 pb-3 pt-10">
          <span className="label-tech text-white">Fotos em breve</span>
          <span className="label-tech tnum text-white/80">00 / 00</span>
        </figcaption>
      </figure>
    );
  }

  const many = images.length > 1;

  return (
    <div className="min-w-0 max-w-full">
      <div className={cn(frame, 'group/gallery')}>
        <div ref={emblaRef} className="overflow-hidden" aria-roledescription="carrossel" aria-label="Fotos do veículo">
          <div className="flex touch-pan-y">
            {images.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/3] min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`Foto ${i + 1} de ${images.length}`}
              >
                <VehicleImage
                  src={src}
                  alt={getVehicleImageAlt(vehicle, i)}
                  priority={i === 0}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>

        {many && (
          <>
            <span className="absolute left-3 top-3 rounded-xs bg-black/70 px-2 py-1 font-heading text-[11px] font-semibold tnum text-white backdrop-blur-sm">
              {pad2(selected + 1)} / {pad2(images.length)}
            </span>
            {[
              { dir: -1, Icon: ChevronLeft, label: 'Foto anterior', pos: 'left-3', disabled: selected === 0 },
              { dir: 1, Icon: ChevronRight, label: 'Próxima foto', pos: 'right-3', disabled: selected === images.length - 1 },
            ].map(({ dir, Icon, label, pos, disabled }) => (
              <button
                key={label}
                type="button"
                onClick={() => scrollTo(selected + dir)}
                disabled={disabled}
                aria-label={label}
                className={cn(
                  'absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-sm border border-white/15 bg-black/60 text-white backdrop-blur-sm transition-[opacity,background-color] hover:bg-red disabled:opacity-0 md:grid',
                  pos,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </button>
            ))}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
              <span
                className="block h-full bg-red transition-[width] duration-500 ease-race"
                style={{ width: `${((selected + 1) / images.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>

      {many && (
        <div className="mt-3 flex gap-2 overflow-x-auto px-gutter scrollbar-none sm:px-0">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={selected === i}
              className={cn(
                'relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xs border-2 transition-[border-color,opacity] sm:w-24',
                selected === i ? 'border-red' : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <VehicleImage src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
