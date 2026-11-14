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

      <div className="absolute inset-x-3 bottom-8 flex justify-center sm:bottom-12">
      <motion.div
        initial={reduceMotion ? false : { x: '-110vw', skewX: -8, filter: 'blur(8px)' }}
        animate={show ? { x: 0, skewX: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: PULL_DURATION, ease: [0.16, 1, 0.3, 1], delay: PULL_DELAY }}
        className="w-full sm:w-[34rem]"
      >
        <div className="glass flex flex-col items-center gap-5 rounded-[2rem] px-6 py-7 text-center sm:px-10">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Zezinho Automóveis
          </h1>
          <p className="text-white/65">Seu próximo carro começa aqui.</p>
          <Link
            to="/estoque"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
          >
            Ver estoque
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
