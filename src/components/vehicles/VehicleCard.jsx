import { Link, useLocation } from 'react-router';
import { ArrowRight, Calendar, Fuel, Gauge, Cog } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import VehicleImage from '@/components/vehicles/VehicleImage';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import {
  formatMileage,
  formatPrice,
  getVehicleCover,
  getVehicleFullName,
  getVehicleImageAlt,
  getVehicleName,
  getVehicleUrl,
  getYearLabel,
  pad2,
} from '@/utils/vehicleUtils';

/**
 * Card automotivo. O título é um link "esticado" que cobre o card inteiro;
 * o botão de WhatsApp fica acima dele (z-index) — sem links aninhados.
 */
export default function VehicleCard({ vehicle, index, priority = false }) {
  const location = useLocation();
  const specs = [
    { icon: Calendar, label: 'Ano', value: getYearLabel(vehicle) },
    { icon: Gauge, label: 'Quilometragem', value: formatMileage(vehicle.mileage) },
    { icon: Cog, label: 'Câmbio', value: vehicle.transmission },
    { icon: Fuel, label: 'Combustível', value: vehicle.fuel },
  ];

  return (
    <article className="vehicle-card group relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-graphite shadow-card transition-[transform,border-color,box-shadow] duration-500 ease-race hover:-translate-y-1 hover:border-red/60 hover:shadow-card-hover active:scale-[0.99]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-700 ease-race group-hover:scale-[1.04]">
          <VehicleImage
            src={getVehicleCover(vehicle)}
            alt={getVehicleImageAlt(vehicle)}
            priority={priority}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-graphite to-transparent" />

        {index != null && (
          <span className="absolute left-3 top-3 rounded-xs bg-black/70 px-1.5 py-0.5 font-heading text-[11px] font-semibold tnum text-white backdrop-blur-sm">
            {pad2(index)}
          </span>
        )}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {vehicle.featured && <Badge>Destaque</Badge>}
          {vehicle.armored && <Badge variant="outline">Blindado</Badge>}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[3px] w-14 bg-red transition-[width] duration-500 ease-race group-hover:w-28"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="label-tech">{vehicle.brand}</p>
        <h3 className="mt-1 font-heading text-xl font-semibold leading-tight text-white">
          <Link
            to={getVehicleUrl(vehicle)}
            state={{ from: location.pathname + location.search }}
            className="card-link outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
          >
            {getVehicleName(vehicle)}
          </Link>
        </h3>

        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-line pt-4 text-[13px] text-gray">
          {specs.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex min-w-0 items-center gap-2">
              <Icon className="size-4 shrink-0 text-gray-dim" aria-hidden="true" />
              <span className="sr-only">{label}:</span>
              <span className="truncate tnum">{value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <p className="label-tech">
            Preço
            {vehicle.oldPrice && (
              <>
                {' '}· de <s className="tnum">{formatPrice(vehicle.oldPrice)}</s>
              </>
            )}
          </p>
          <p className="font-heading text-[1.65rem] font-semibold leading-tight tnum text-white">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <div className="mt-4 grid gap-1">
          <span
            aria-hidden="true"
            className="inline-flex h-11 items-center justify-between gap-2 rounded-sm border border-line-strong px-4 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 group-hover:border-red group-hover:bg-red"
          >
            Ver detalhes
            <ArrowRight className="size-4 transition-transform duration-300 ease-race group-hover:translate-x-1" />
          </span>
          <a
            href={generateWhatsAppLink(vehicle)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Tenho interesse no ${getVehicleFullName(vehicle)} — conversar no WhatsApp`}
            className="relative z-[2] inline-flex h-11 items-center justify-center gap-2 rounded-sm font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-gray transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
          >
            <WhatsAppIcon className="size-4" />
            Tenho interesse
          </a>
        </div>
      </div>
    </article>
  );
}
