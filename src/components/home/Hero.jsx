import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* Vídeo acelerado: o carro cruza a tela em ~2.7s. */
const SPEED = 1.6;
/* O painel vem logo atrás do carro, como se fosse puxado, e para no centro. */
const PULL_DELAY = 0.55;
const PULL_DURATION = 1.9;

/**
 * Hero em tela cheia: só o vídeo do carro. O painel de vidro com o nome
 * da loja entra pela esquerda junto com o carro e fica no centro.
 */
export default function Hero() {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduceMotion) return setShow(true);
    const v = videoRef.current;
    if (v) v.playbackRate = SPEED;
    const onPlay = () => setShow(true);
    const fallback = setTimeout(() => v?.paused && setShow(true), 2500);
    v?.addEventListener('playing', onPlay, { once: true });
    v?.play?.().catch(() => {});
    return () => {
      clearTimeout(fallback);
      v?.removeEventListener('playing', onPlay);
    };
  }, [reduceMotion]);

  return (
    <section aria-label="Zezinho Automóveis" className="full-bleed relative isolate h-svh min-h-[34rem] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
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
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-black to-transparent" />

      {/* Textos no caminho do carro: vêm puxados por ele, da esquerda */}
      <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 flex-col items-center text-center">
        <motion.h1
          initial={reduceMotion ? false : { x: '-110vw', skewX: -10, filter: 'blur(10px)' }}
          animate={show ? { x: 0, skewX: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: PULL_DURATION, ease: [0.16, 1, 0.3, 1], delay: PULL_DELAY }}
          className="font-heading text-[clamp(2.6rem,9vw,7.5rem)] font-semibold leading-none tracking-tight text-white [text-shadow:0_10px_40px_rgb(0_0_0/0.6)]"
        >
          Zezinho Automóveis
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { x: '-110vw', filter: 'blur(10px)' }}
          animate={show ? { x: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: PULL_DURATION, ease: [0.16, 1, 0.3, 1], delay: PULL_DELAY + 0.15 }}
          className="mt-4 text-[clamp(1rem,2.2vw,1.6rem)] text-white/75"
        >
          A melhor loja da região.
        </motion.p>
      </div>

      {/* Barra de vidro achatada com a ação */}
      <div className="absolute inset-x-3 bottom-6 flex justify-center sm:bottom-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: PULL_DELAY + PULL_DURATION * 0.6 }}
          className="glass flex w-full items-center justify-between gap-4 rounded-full py-1.5 pl-6 pr-1.5 sm:w-auto sm:gap-8"
        >
          <p className="text-sm text-white/75">Seu próximo carro começa aqui.</p>
          <Link
            to="/estoque"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
          >
            Ver estoque
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
