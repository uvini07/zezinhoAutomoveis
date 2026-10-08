import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useVehicles } from '@/hooks/useVehicles';
import { pad2 } from '@/utils/vehicleUtils';

/** Número que conta até o valor quando entra na tela (telemetria). */
function CountUp({ value, format = pad2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return <span ref={ref}>{format(display)}</span>;
}

/** Faixa de telemetria logo abaixo do hero — números derivados do estoque. */
export default function StatsStrip() {
  const { vehicles, isLoading } = useVehicles();
  const minPrice = vehicles.length ? Math.min(...vehicles.map((v) => v.price)) : 0;

  const stats = [
    { label: 'Veículos disponíveis', value: vehicles.length },
    { label: 'Marcas no estoque', value: new Set(vehicles.map((v) => v.brand)).size },
    { label: 'Carrocerias', value: new Set(vehicles.map((v) => v.category)).size },
    {
      label: 'Mil · a partir de',
      value: Math.floor(minPrice / 1000),
      format: (n) => (
        <>
          <span className="mr-1 align-top text-[0.45em] leading-none">R$</span>
          {n}
        </>
      ),
    },
  ];

  return (
    <section aria-label="Resumo do estoque" className="border-b border-line bg-black-2">
      <div className="shell">
        <dl className="grid grid-cols-2 gap-px border-x border-line bg-line lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-2 bg-black-2 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <dt className="label-tech">{stat.label}</dt>
              <dd className="display text-5xl tnum text-white sm:text-6xl">
                {isLoading ? (
                  <span className="skeleton-surface inline-block h-[0.8em] w-[1.6em] rounded-xs align-middle" />
                ) : (
                  <CountUp value={stat.value} format={stat.format} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
