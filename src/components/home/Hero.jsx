import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const ease = [0.22, 1, 0.36, 1];

/** Linha do título revelada por máscara (sobe de baixo). */
function MaskLine({ delay, children }) {
  return (
    // padding/margem negativos no topo: a máscara não corta acentos (Ó, É…)
    <span className="-mt-[0.16em] block overflow-hidden pb-[0.04em] pt-[0.16em]">
      <motion.span
        className="block"
        initial={{ y: '135%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/** Diagonais decorativas (45°, como o símbolo) desenhadas na entrada. */
function HeroLines() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {[
        { x1: 58, x2: 100, y2: 58, o: 0.06, d: 0.3 },
        { x1: 70, x2: 100, y2: 30, o: 0.05, d: 0.45 },
        { x1: 40, x2: 100, y2: 60, o: 0.035, d: 0.6 },
      ].map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={0}
          x2={l.x2}
          y2={l.y2}
          stroke="white"
          strokeOpacity={l.o}
          strokeWidth="0.15"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease, delay: l.d }}
        />
      ))}
    </svg>
  );
}

/**
 * Hero editorial: título grande à esquerda, fotografia real da loja à
 * direita (desktop) cortada em diagonal, ou logo abaixo do texto (mobile).
 */
export default function Hero() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '10%']);

  return (
    <section ref={ref} aria-labelledby="hero-titulo" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
      />
      <HeroLines />

      <div className="shell relative z-10 flex flex-col justify-center pb-10 pt-8 sm:pt-12 lg:min-h-[calc(100svh-5rem)] lg:max-h-[56rem] lg:py-16">
        <div className="lg:max-w-[46rem] xl:max-w-[52rem]">
          <motion.div {...fadeUp(0)} className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span aria-hidden="true" className="size-2 bg-red" />
            <span className="label-tech whitespace-nowrap text-white">Zezinho Automóveis</span>
            <span aria-hidden="true" className="hidden h-px w-10 bg-line-strong sm:block" />
            <span className="label-tech basis-full whitespace-nowrap pl-5 sm:basis-auto sm:pl-0">01 / Showroom digital</span>
          </motion.div>

          <h1
            id="hero-titulo"
            className="display mt-6 text-[clamp(3.6rem,16.5vw,6.5rem)] lg:text-[clamp(6.5rem,8.6vw,9.75rem)]"
          >
            <MaskLine delay={0.1}>Seu próximo</MaskLine>
            <MaskLine delay={0.18}>carro começa</MaskLine>
            <MaskLine delay={0.26}>
              aqui<span className="text-red">.</span>
            </MaskLine>
          </h1>

          <motion.p {...fadeUp(0.45)} className="mt-6 max-w-md text-base leading-relaxed text-gray sm:text-lg">
            Veículos selecionados, procedência e atendimento especializado.
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/estoque" size="lg">
              Ver estoque
            </Button>
            <WhatsAppButton size="lg">Falar no WhatsApp</WhatsAppButton>
          </motion.div>
        </div>

        <motion.a
          {...fadeUp(0.8)}
          href="#destaques"
          className="group mt-14 hidden w-fit items-center gap-3 lg:inline-flex"
        >
          <span className="grid size-10 place-items-center rounded-sm border border-line-strong transition-colors group-hover:border-red group-hover:bg-red">
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
          </span>
          <span className="label-tech text-white">Explore o estoque</span>
        </motion.a>
      </div>

      {/* Fotografia real da loja */}
      <motion.figure
        initial={{ clipPath: 'inset(0 0 0 100%)' }}
        animate={{ clipPath: 'inset(0 0 0 0%)' }}
        transition={{ duration: 1.1, ease, delay: 0.25 }}
        className="relative mx-gutter mb-10 aspect-[4/3] overflow-hidden rounded-md border border-line sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:m-0 lg:aspect-auto lg:w-[50%] lg:rounded-none lg:border-0 xl:w-[52%]"
      >
        <div className="absolute inset-0 lg:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]">
          <motion.picture style={{ y: photoY }} className="absolute inset-0 block scale-110">
            <source srcSet="/img/loja-fachada.avif" type="image/avif" />
            <source srcSet="/img/loja-fachada.webp" type="image/webp" />
            <img
              src="/img/loja-fachada.jpg"
              alt="Fachada da loja Zezinho Automóveis com veículos expostos no showroom"
              width="1024"
              height="768"
              fetchPriority="high"
              className="h-full w-full object-cover object-[50%_60%]"
            />
          </motion.picture>
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/30 lg:bg-linear-to-r lg:from-black lg:via-black/20 lg:to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-50" />
        </div>

        <span aria-hidden="true" className="absolute left-3 top-3 size-4 border-l border-t border-white/40 lg:left-auto lg:right-6 lg:top-6 lg:border-l-0 lg:border-r" />
        <figcaption className="absolute bottom-4 left-4 flex items-center gap-2.5 lg:bottom-8 lg:left-auto lg:right-8">
          <span aria-hidden="true" className="size-2 bg-red" />
          <span className="label-tech text-white">Nossa loja · Showroom</span>
        </figcaption>
      </motion.figure>
    </section>
  );
}
