import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const ease = [0.22, 1, 0.36, 1];

/* Tempos do vídeo (s): o carro cruza a tela entre ~0.3s e ~5s. */
const CAR_ENTER = 0.3;
const CAR_EXIT = 4.6;

/** Linha do título revelada por máscara (sobe de baixo). */
function MaskLine({ show, delay, children }) {
  return (
    <span className="-mt-[0.16em] block overflow-hidden pb-[0.04em] pt-[0.16em]">
      <motion.span
        className="block"
        initial={{ y: '135%' }}
        animate={show ? { y: 0 } : { y: '135%' }}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const fadeUp = (show, delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
  transition: { duration: 0.7, ease, delay },
});

/** Texto repetido da faixa: "ZEZINHO AUTOMÓVEIS ■ ZEZINHO AUTOMÓVEIS ■ …" */
function BannerText({ count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
      ZEZINHO AUTOMÓVEIS
      <span aria-hidden="true" className="size-2 rotate-45 bg-current" />
    </span>
  ));
}

/**
 * Faixa diagonal que entra da esquerda junto com o carro e depois
 * continua deslizando devagar, como banner de pista.
 */
function Banner({ play, delay, className, tone }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute left-[-10%] w-[120%] overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={play ? { clipPath: 'inset(0 0% 0 0)' } : {}}
      transition={{ duration: CAR_EXIT - CAR_ENTER, ease: [0.45, 0, 0.55, 1], delay }}
    >
      <div
        className={`flex w-max animate-[banner_28s_linear_infinite] py-2 font-display text-[clamp(1.1rem,2.4vw,2rem)] tracking-[0.12em] sm:py-3 ${tone}`}
      >
        <BannerText />
        <BannerText />
      </div>
    </motion.div>
  );
}

/**
 * Hero em vídeo: um esportivo vermelho cruza o estúdio escuro da esquerda
 * para a direita, puxando as faixas "Zezinho Automóveis". Quando ele sai,
 * o título e as ações aparecem.
 */
export default function Hero() {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [play, setPlay] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setPlay(true);
      setShowText(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    let timer;
    const start = () => {
      setPlay(true);
      timer = setTimeout(() => setShowText(true), (CAR_EXIT - 0.4) * 1000);
    };
    // Se o vídeo não conseguir tocar (economia de dados, autoplay bloqueado),
    // o texto aparece mesmo assim.
    const fallback = setTimeout(() => {
      if (v.paused) {
        setPlay(true);
        setShowText(true);
      }
    }, 2500);
    v.addEventListener('playing', start, { once: true });
    v.play?.().catch(() => {});
    return () => {
      clearTimeout(timer);
      clearTimeout(fallback);
      v.removeEventListener('playing', start);
    };
  }, [reduceMotion]);

  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden border-b border-line bg-black"
    >
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        poster="/hero/carro-vermelho-poster.jpg"
        muted
        playsInline
        preload="auto"
        autoPlay={!reduceMotion}
        aria-hidden="true"
      >
        <source src="/hero/carro-vermelho.webm" type="video/webm" />
        <source src="/hero/carro-vermelho.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/20 to-black/60" />

      {/* Faixas que acompanham o carro */}
      <Banner
        play={play}
        delay={CAR_ENTER}
        className="top-[5%] -rotate-2 sm:top-[7%]"
        tone="bg-red text-white"
      />
      <Banner
        play={play}
        delay={CAR_ENTER + 0.25}
        className="top-[12%] rotate-1 sm:top-[15%]"
        tone="border-y border-line-strong bg-black/80 text-white/80 [animation-direction:reverse]"
      />

      <div className="shell relative z-10 mt-auto pb-12 pt-48 sm:pb-16 sm:pt-56">
        <motion.div {...fadeUp(showText, 0)} className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden="true" className="size-2 bg-red" />
          <span className="label-tech whitespace-nowrap text-white">Zezinho Automóveis</span>
          <span aria-hidden="true" className="hidden h-px w-10 bg-line-strong sm:block" />
          <span className="label-tech whitespace-nowrap">01 / Showroom digital</span>
        </motion.div>

        <h1
          id="hero-titulo"
          className="display mt-5 max-w-[60rem] text-[clamp(3.4rem,14vw,6rem)] lg:text-[clamp(6rem,8vw,9rem)]"
        >
          <MaskLine show={showText} delay={0.05}>Seu próximo</MaskLine>
          <MaskLine show={showText} delay={0.13}>carro começa</MaskLine>
          <MaskLine show={showText} delay={0.21}>
            aqui<span className="text-red">.</span>
          </MaskLine>
        </h1>

        <motion.p {...fadeUp(showText, 0.4)} className="mt-5 max-w-md text-base leading-relaxed text-gray sm:text-lg">
          Veículos selecionados, procedência e atendimento especializado.
        </motion.p>

        <motion.div {...fadeUp(showText, 0.5)} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/estoque" size="lg">
            Ver estoque
          </Button>
          <WhatsAppButton size="lg">Falar no WhatsApp</WhatsAppButton>
        </motion.div>

        <motion.a
          {...fadeUp(showText, 0.7)}
          href="#destaques"
          className="group mt-12 hidden w-fit items-center gap-3 lg:inline-flex"
        >
          <span className="grid size-10 place-items-center rounded-sm border border-line-strong transition-colors group-hover:border-red group-hover:bg-red">
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
          </span>
          <span className="label-tech text-white">Explore o estoque</span>
        </motion.a>
      </div>
    </section>
  );
}
