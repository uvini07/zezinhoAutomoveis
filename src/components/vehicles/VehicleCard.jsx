import { Link, useLocation } from 'react-router';
import Badge from '@/components/ui/Badge';
import VehicleImage from '@/components/vehicles/VehicleImage';
import {
  formatMileage,
  formatPrice,
  getVehicleCover,
  getVehicleImageAlt,
  getVehicleName,
  getVehicleUrl,
  getYearLabel,
} from '@/utils/vehicleUtils';

/**
 * Cartão de vidro: foto, nome, ano · km e preço. O título é um link
 * "esticado" que cobre o cartão inteiro.
 */
export default function VehicleCard({ vehicle, priority = false }) {
  const location = useLocation();

  return (
    <article className="vehicle-card glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-2 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-white/5">
        <div className="absolute inset-0 transition-transform duration-700 ease-race group-hover:scale-[1.04]">
          <VehicleImage
            src={getVehicleCover(vehicle)}
            alt={getVehicleImageAlt(vehicle)}
            priority={priority}
            sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        {(vehicle.featured || vehicle.armored || vehicle.oldPrice) && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {vehicle.oldPrice && <Badge>Oferta</Badge>}
            {vehicle.featured && <Badge variant="outline">Destaque</Badge>}
            {vehicle.armored && <Badge variant="outline">Blindado</Badge>}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="text-xs text-gray-dim">{vehicle.brand}</p>
        <h3 className="mt-0.5 truncate font-heading text-lg font-medium text-white">
          <Link
            to={getVehicleUrl(vehicle)}
            state={{ from: location.pathname + location.search }}
            className="card-link outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
          >
            {getVehicleName(vehicle)}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="text-sm text-gray">
            {getYearLabel(vehicle)} · {formatMileage(vehicle.mileage)}
          </p>
          <p className="shrink-0 font-heading text-lg font-semibold tnum text-white">{formatPrice(vehicle.price)}</p>
        </div>
      </div>
    </article>
  );
}
