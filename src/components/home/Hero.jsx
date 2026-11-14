import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];
/* O carro sai da tela por volta de 4.6s. */
const CAR_EXIT = 4.6;

/**
 * Hero em tela cheia: só o vídeo do carro. Quando ele sai, um painel de
 * vidro aparece com o nome da loja e uma única ação.
 */
export default function Hero() {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduceMotion) return setShow(true);
    const v = videoRef.current;
    let timer;
    const onPlay = () => (timer = setTimeout(() => setShow(true), (CAR_EXIT - 0.3) * 1000));
    const fallback = setTimeout(() => v?.paused && setShow(true), 2500);
    v?.addEventListener('playing', onPlay, { once: true });
    v?.play?.().catch(() => {});
    return () => {
      clearTimeout(timer);
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

      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
        animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1, ease }}
        className="absolute inset-x-3 bottom-8 sm:inset-x-auto sm:bottom-12 sm:left-1/2 sm:w-[34rem] sm:-translate-x-1/2"
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
    </section>
  );
}
