import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { ArrowLeft, Check, MessageSquareText } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/ui/JsonLd';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import VehicleGallery from '@/components/vehicles/VehicleGallery';
import VehicleQuickSpecs from '@/components/vehicles/VehicleQuickSpecs';
import VehicleGrid from '@/components/vehicles/VehicleGrid';
import StickyVehicleCTA from '@/components/vehicles/StickyVehicleCTA';
import ShareButton from '@/components/vehicles/ShareButton';
import NotFound from '@/pages/NotFound';
import { useVehicles } from '@/hooks/useVehicles';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { SITE } from '@/config/site';
import {
  findVehicle,
  formatMileage,
  formatPrice,
  getSimilarVehicles,
  getVehicleFullName,
  getVehicleImages,
  getVehicleName,
  getVehicleSlug,
  getVehicleSpecList,
  getVehicleUrl,
  getYearLabel,
  pad2,
} from '@/utils/vehicleUtils';

function DetailSection({ index, title, children }) {
  return (
    <Reveal as="section" className="border-t border-line py-10 first:border-t-0 lg:py-12">
      <h2 className="mb-6 flex items-center gap-3">
        <span className="font-heading text-xs font-semibold tnum text-white">{index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-red" />
        <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em]">{title}</span>
      </h2>
      {children}
    </Reveal>
  );
}

function DetailsSkeleton() {
  return (
    <div className="shell pb-section pt-6 lg:pt-10" aria-busy="true" aria-label="Carregando veículo">
      <div className="skeleton-surface h-4 w-40 rounded-xs" />
      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="skeleton-surface aspect-[4/3] rounded-md lg:col-span-7 xl:col-span-8" />
        <div className="space-y-4 lg:col-span-5 xl:col-span-4">
          <div className="skeleton-surface h-4 w-24 rounded-xs" />
          <div className="skeleton-surface h-10 w-3/4 rounded-xs" />
          <div className="skeleton-surface h-12 w-1/2 rounded-xs" />
          <div className="skeleton-surface h-40 rounded-md" />
          <div className="skeleton-surface h-14 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

function buildVehicleSchema(vehicle) {
  const images = getVehicleImages(vehicle);
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${getVehicleFullName(vehicle)} ${vehicle.year}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    ...(vehicle.mileage != null && {
      mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'KMT' },
    }),
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuel,
    bodyType: vehicle.category,
    color: vehicle.specs?.color,
    description: vehicle.description,
    ...(images.length && { image: images.map((src) => `${SITE.url}${src}`) }),
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'BRL',
      url: `${SITE.url}${getVehicleUrl(vehicle)}`,
      seller: { '@type': 'AutoDealer', name: SITE.name },
    },
  };
}

export default function VehicleDetails() {
  const { slug } = useParams();
  const location = useLocation();
  const { vehicles, isLoading } = useVehicles();
  const vehicle = useMemo(() => findVehicle(vehicles, slug), [vehicles, slug]);
  const similar = useMemo(() => (vehicle ? getSimilarVehicles(vehicle, vehicles, 3) : []), [vehicle, vehicles]);

  useDocumentMeta(
    vehicle
      ? {
          title: `${getVehicleFullName(vehicle)} ${vehicle.year}`,
          description: `${getVehicleFullName(vehicle)} ${vehicle.year}, ${formatMileage(vehicle.mileage).toLowerCase()}, ${vehicle.transmission.toLowerCase()}, ${vehicle.fuel.toLowerCase()}. ${formatPrice(vehicle.price)}. Fale com a Zezinho Automóveis.`,
          path: getVehicleUrl(vehicle),
        }
      : { title: 'Veículo' },
  );

  if (isLoading) return <DetailsSkeleton />;
  if (!vehicle) return <NotFound variant="vehicle" />;

  const backTo = location.state?.from?.startsWith('/estoque') ? location.state.from : '/estoque';
  const fullName = getVehicleFullName(vehicle);
  const specList = getVehicleSpecList(vehicle);

  return (
    <>
      <PageTransition>
        <div className="shell pt-4 lg:pt-8">
          <Link
            to={backTo}
            className="group inline-flex min-h-11 items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-gray transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Voltar para o estoque
          </Link>

          <article className="mt-2 grid gap-x-12 lg:mt-4 lg:grid-cols-12">
            {/* Galeria */}
            <div className="-mx-gutter sm:mx-0 lg:col-span-7 lg:col-start-1 lg:row-start-1 xl:col-span-8">
              <VehicleGallery vehicle={vehicle} />
            </div>

            {/* Resumo + CTAs (sticky no desktop) */}
            <aside className="pt-6 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:pt-0 xl:col-span-4 xl:col-start-9">
              <div className="lg:sticky lg:top-24">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label-tech text-white">{vehicle.brand}</span>
                  <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
                  <span className="label-tech">{vehicle.category}</span>
                  <span className="ml-auto flex gap-1.5">
                    {vehicle.armored && <Badge variant="outline">Blindado</Badge>}
                    {vehicle.featured && <Badge>Destaque</Badge>}
                  </span>
                </div>
                <h1 className="mt-3 font-heading text-[2.15rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[2.75rem]">
                  {getVehicleName(vehicle)}
                </h1>
                <p className="mt-2 text-sm text-gray">
                  {fullName} · {getYearLabel(vehicle)} · {formatMileage(vehicle.mileage)}
                </p>

                <div className="redline mt-6 w-24" aria-hidden="true" />

                <div className="mt-6">
                  <p className="label-tech">
                    Preço
                    {vehicle.oldPrice && (
                      <>
                        {' '}· de <s className="tnum">{formatPrice(vehicle.oldPrice)}</s>
                      </>
                    )}
                  </p>
                  <p className="font-heading text-[2.6rem] font-semibold leading-tight tnum sm:text-5xl">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>

                <div className="mt-6">
                  <VehicleQuickSpecs vehicle={vehicle} />
                </div>

                <div className="mt-6 grid gap-3">
                  <WhatsAppButton vehicle={vehicle} variant="primary" size="lg" fullWidth>
                    Quero este carro
                  </WhatsAppButton>
                  <Button
                    to={`/contato?veiculo=${getVehicleSlug(vehicle)}`}
                    variant="secondary"
                    size="lg"
                    fullWidth
                    iconLeft={MessageSquareText}
                    icon={null}
                  >
                    Tenho interesse
                  </Button>
                  <ShareButton title={`${fullName} ${vehicle.year}`} text={`${fullName} na Zezinho Automóveis`} />
                </div>
              </div>
            </aside>

            {/* Conteúdo */}
            <div className="lg:col-span-7 lg:col-start-1 lg:row-start-2 xl:col-span-8">
              <DetailSection index="01" title="Descrição">
                <p className="max-w-2xl text-base leading-relaxed text-gray sm:text-lg">{vehicle.description}</p>
              </DetailSection>

              {vehicle.highlights?.length > 0 && (
                <DetailSection index="02" title="Destaques">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {vehicle.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3 rounded-sm border border-line bg-graphite px-4 py-3.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-red-bright" aria-hidden="true" />
                        <span className="text-[15px] text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </DetailSection>
              )}

              <DetailSection index="03" title="Especificações">
                <dl className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
                  {specList.map(({ label, value }, i) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 bg-black-2 px-4 py-3.5">
                      <dt className="flex items-baseline gap-3 text-sm text-gray">
                        <span className="font-heading text-[10px] tnum text-gray-dim">{pad2(i + 1)}</span>
                        {label}
                      </dt>
                      <dd className="text-right font-heading text-[15px] font-semibold text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
              </DetailSection>
            </div>
          </article>
        </div>

        {similar.length > 0 && (
          <section aria-labelledby="similares-titulo" className="mt-8 border-t border-line py-section">
            <div className="shell">
              <SectionHeader
                id="similares-titulo"
                eyebrow="Continue explorando"
                title="Você também pode gostar"
                action={
                  <Button to="/estoque" variant="secondary">
                    Ver estoque completo
                  </Button>
                }
              />
              <div className="mt-10">
                <VehicleGrid vehicles={similar} layout="full" label="Veículos semelhantes" />
              </div>
            </div>
          </section>
        )}

        <JsonLd data={buildVehicleSchema(vehicle)} />
      </PageTransition>

      <StickyVehicleCTA vehicle={vehicle} />
    </>
  );
}
