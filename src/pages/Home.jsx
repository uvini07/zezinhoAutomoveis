import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/home/Hero';
import VehicleImage from '@/components/vehicles/VehicleImage';
import JsonLd from '@/components/ui/JsonLd';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useVehicles } from '@/hooks/useVehicles';
import { SITE } from '@/config/site';
import {
  formatMileage,
  formatPrice,
  getVehicleCover,
  getVehicleImageAlt,
  getVehicleName,
  getVehicleUrl,
  getYearLabel,
  sortVehicles,
} from '@/utils/vehicleUtils';

const dealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  image: `${SITE.url}/img/og-image.jpg`,
  logo: `${SITE.url}/img/logo-zezinho.png`,
};

/** Card de vidro: foto, nome, ano · km e preço. Nada além disso. */
function GlassCar({ vehicle, priority }) {
  return (
    <Link
      to={getVehicleUrl(vehicle)}
      className="glass glass-hover group block overflow-hidden rounded-[1.75rem] p-2 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-white/5">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <VehicleImage
            src={getVehicleCover(vehicle)}
            alt={getVehicleImageAlt(vehicle)}
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </div>
      <div className="px-3 pb-3 pt-4">
        <p className="text-xs text-white/50">{vehicle.brand}</p>
        <h3 className="mt-0.5 truncate font-heading text-lg font-medium text-white">{getVehicleName(vehicle)}</h3>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-sm text-white/55">
            {getYearLabel(vehicle)} · {formatMileage(vehicle.mileage)}
          </p>
          <p className="font-heading text-lg font-semibold text-white tnum">{formatPrice(vehicle.price)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  useDocumentMeta({ path: '/' });
  const { vehicles } = useVehicles();
  const list = sortVehicles(vehicles, 'recentes').slice(0, 9);

  return (
    <div className="full-bleed">
      <Hero />

      <section id="estoque" aria-labelledby="estoque-titulo" className="relative px-3 pt-20 sm:px-6">
        {/* brilho vermelho de fundo para o vidro ter o que refratar */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-24 -z-0 h-[30rem] w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-red/25 blur-[140px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="estoque-titulo" className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Estoque
            </h2>
            <Link to="/estoque" className="glass glass-hover inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-white">
              Ver todos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((v, i) => (
              <GlassCar key={v.id} vehicle={v} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={dealerSchema} />
    </div>
  );
}
