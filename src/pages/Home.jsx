import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRight, FileCheck, Handshake, ShieldCheck } from 'lucide-react';
import Hero from '@/components/home/Hero';
import Reveal from '@/components/ui/Reveal';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import VehicleCard from '@/components/vehicles/VehicleCard';
import SkeletonVehicleCard from '@/components/vehicles/SkeletonVehicleCard';
import JsonLd from '@/components/ui/JsonLd';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useGlowGrid } from '@/hooks/useGlowGrid';
import { useVehicles } from '@/hooks/useVehicles';
import { SITE } from '@/config/site';
import { sortVehicles } from '@/utils/vehicleUtils';

const dealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  image: `${SITE.url}/img/og-image.jpg`,
  logo: `${SITE.url}/img/logo-zezinho.png`,
};

const VALORES = [
  { icon: ShieldCheck, title: 'Procedência', text: 'Veículos selecionados com atenção aos detalhes.' },
  { icon: FileCheck, title: 'Transparência', text: 'Informações claras para você comprar com segurança.' },
  { icon: Handshake, title: 'Atendimento', text: 'Atendimento próximo e especializado.' },
];

/** Destaques primeiro, depois os que chegaram por último. */
function pickShowcase(vehicles, count = 6) {
  const featured = sortVehicles(vehicles.filter((v) => v.featured), 'recentes');
  const rest = sortVehicles(vehicles.filter((v) => !v.featured), 'recentes');
  return [...featured, ...rest].slice(0, count);
}

export default function Home() {
  useDocumentMeta({ path: '/' });
  const { vehicles, isLoading } = useVehicles();
  const showcase = useMemo(() => pickShowcase(vehicles), [vehicles]);
  const carsGlow = useGlowGrid();
  const valuesGlow = useGlowGrid();

  return (
    <div className="full-bleed">
      <Hero />

      {/* Estoque */}
      <section id="vitrine" aria-labelledby="estoque-titulo" className="shell scroll-mt-4 pt-24 sm:pt-32">
        <Reveal className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-tech">Escolhidos a dedo</p>
            <h2 id="estoque-titulo" className="display mt-2 text-[clamp(2.25rem,5vw,3.5rem)]">
              No showroom agora
            </h2>
          </div>
          <Link
            to="/estoque"
            className="glass glass-hover hidden h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm text-white sm:inline-flex"
          >
            Ver todos{!isLoading && ` os ${vehicles.length}`}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <ul
          ref={carsGlow.ref}
          onPointerMove={carsGlow.onPointerMove}
          className="glow-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(isLoading ? Array.from({ length: 6 }) : showcase).map((v, i) => (
            <Reveal as="li" key={v?.id ?? i} delay={(i % 3) * 0.06}>
              {v ? <VehicleCard vehicle={v} priority={i < 3} /> : <SkeletonVehicleCard />}
            </Reveal>
          ))}
        </ul>

        <Link
          to="/estoque"
          className="glass glass-hover mt-6 flex h-12 items-center justify-center gap-2 rounded-full text-sm text-white sm:hidden"
        >
          Ver todos{!isLoading && ` os ${vehicles.length}`}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Por que a Zezinho */}
      <section id="sobre" aria-label="Por que a Zezinho" className="shell scroll-mt-24 pt-24 sm:pt-32">
        <ul
          ref={valuesGlow.ref}
          onPointerMove={valuesGlow.onPointerMove}
          className="glow-grid grid gap-4 sm:grid-cols-3"
        >
          {VALORES.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08} className="glow-card glass rounded-3xl p-6">
              <span className="grid size-11 place-items-center rounded-full bg-red/20 text-red-bright">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-gray">{text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Chamada final */}
      <section aria-labelledby="cta-titulo" className="shell pt-24 sm:pt-32">
        <Reveal className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[40rem] max-w-[140%] -translate-x-1/2 rounded-full bg-red/35 blur-[100px]" />
          <h2 id="cta-titulo" className="display relative mx-auto max-w-2xl text-[clamp(2.25rem,6vw,4rem)]">
            Vamos encontrar o seu?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray sm:text-base">
            Fale com a gente pelo WhatsApp e receba atendimento na hora.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton variant="primary" size="lg">
              Falar no WhatsApp
            </WhatsAppButton>
            <a href={SITE.phoneHref} className="text-sm text-white/70 transition-colors hover:text-white sm:ml-3">
              ou ligue {SITE.phone}
            </a>
          </div>
        </Reveal>
      </section>

      <JsonLd data={dealerSchema} />
    </div>
  );
}
