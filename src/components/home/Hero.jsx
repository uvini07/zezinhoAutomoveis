import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { getVehicleCover, getVehicleFullName, sortVehicles } from '@/utils/vehicleUtils';

/* Vídeo acelerado: o carro cruza a tela em ~2.7s. */
const SPEED = 1.6;
/* Os textos vêm logo atrás do carro, como se fossem puxados, e param no centro. */
const PULL_DELAY = 0.55;
const PULL_DURATION = 1.9;
const pullEase = [0.16, 1, 0.3, 1];

/**
 * Prepara o vídeo para tocar sozinho em qualquer celular: o React não
 * escreve o atributo `muted` no HTML, e sem ele o iOS bloqueia o autoplay
 * e mostra o botão de play.
 */
function primeVideo(v) {
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
  v.playbackRate = SPEED;
}

function Pulled({ as: Tag = 'div', show, delay = 0, className, children, ...props }) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      initial={{ x: '-110vw', skewX: -10, filter: 'blur(10px)' }}
      animate={show ? { x: 0, skewX: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: PULL_DURATION, ease: pullEase, delay: PULL_DELAY + delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Convite para rolar: miniaturas de três carros do estoque, a frase e uma
 * seta que pulsa. Leva até a busca logo abaixo do hero.
 */
function ScrollCue({ show, delay }) {
  const { vehicles } = useVehicles();
  const reduceMotion = useReducedMotion();
  const thumbs = useMemo(() => {
    const withPhoto = vehicles.filter((v) => getVehicleCover(v));
    const featured = sortVehicles(withPhoto.filter((v) => v.featured), 'recentes');
    return [...featured, ...withPhoto.filter((v) => !v.featured)].slice(0, 3);
  }, [vehicles]);
  const extra = vehicles.length - thumbs.length;

  function goToShowcase(event) {
    const target = document.getElementById('busca');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }

  return (
    <motion.a
      href="#busca"
      onClick={goToShowcase}
      initial={{ opacity: 0, y: 16 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: pullEase, delay }}
      className="group flex flex-col items-center gap-3 text-center"
    >
      {thumbs.length > 0 && (
        <span className="flex items-center" aria-hidden="true">
          {thumbs.map((v, i) => (
            <img
              key={v.id}
              src={getVehicleCover(v)}
              alt=""
              width="48"
              height="48"
              decoding="async"
              className="size-12 rounded-full border-2 border-black/80 object-cover shadow-lg transition-transform duration-500 ease-race group-hover:-translate-y-0.5"
              style={{ marginLeft: i ? '-0.85rem' : 0, transitionDelay: `${i * 40}ms` }}
            />
          ))}
          {extra > 0 && (
            <span className="glass -ml-[0.85rem] grid size-12 place-items-center rounded-full text-xs font-medium tnum text-white">
              +{extra}
            </span>
          )}
        </span>
      )}
      <span className="text-[15px] font-medium text-white">Venha conhecer seu futuro automóvel</span>
      <motion.span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 backdrop-blur-md transition-colors group-hover:bg-white/15"
        animate={reduceMotion ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="size-4" />
      </motion.span>
      <span className="sr-only">
        Ver carros em destaque{thumbs.length ? `: ${thumbs.map(getVehicleFullName).join(', ')}` : ''}
      </span>
    </motion.a>
  );
}

/**
 * Hero em tela cheia. O esportivo cruza o estúdio e puxa o nome da loja,
 * que pousa sobre o piso com reflexo. Depois, a câmera se aproxima devagar.
 */
export default function Hero() {
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(Boolean(reduceMotion));
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    primeVideo(v);
    if (reduceMotion) {
      setShow(true);
      return undefined;
    }

    const tryPlay = () => v.play().catch(() => {});
    const onPlaying = () => setShow(true);
    const onEnded = () => setEnded(true);
    // Modo economia de energia/dados pode impedir o autoplay: tenta de novo
    // no primeiro toque ou rolagem, e mostra os textos de qualquer jeito.
    const unlock = () => v.paused && !v.ended && tryPlay();
    const fallback = setTimeout(() => {
      if (v.paused) {
        setShow(true);
        setEnded(true);
      }
    }, 1800);

    v.addEventListener('playing', onPlaying, { once: true });
    v.addEventListener('ended', onEnded);
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('scroll', unlock, { once: true, passive: true });
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener('canplay', tryPlay, { once: true });

    return () => {
      clearTimeout(fallback);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('canplay', tryPlay);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('scroll', unlock);
    };
  }, [reduceMotion]);

  return (
    <section aria-label="Zezinho Automóveis" className="full-bleed relative isolate h-svh min-h-[36rem] overflow-hidden bg-black">
      {/* Vídeo: depois que o carro sai, aproxima devagar */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        animate={ended && !reduceMotion ? { scale: 1.08 } : { scale: 1 }}
        transition={{ duration: 14, ease: 'easeOut' }}
      >
        <video
          ref={videoRef}
          className="bg-video h-full w-full object-cover"
          poster="/hero/carro-vermelho-poster.jpg"
          muted
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        >
          <source src="/hero/carro-vermelho.webm" type="video/webm" />
          <source src="/hero/carro-vermelho.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Luz vermelha que acende atrás do nome quando o carro passa */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[44%] -z-10 h-[22rem] w-[min(70rem,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red/30 blur-[120px]"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ duration: 2.4, delay: PULL_DELAY + 0.8 }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-linear-to-t from-black via-black/60 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/70 to-transparent" />

      {/* Nome pousado no piso, com reflexo */}
      <div className="absolute inset-x-4 top-[57%] -translate-y-full text-center">
        <Pulled as="p" show={show} className="text-[clamp(0.95rem,1.8vw,1.35rem)] text-white/75">
          A melhor loja da região.
        </Pulled>
        <Pulled
          as="h1"
          show={show}
          delay={0.08}
          className="mt-3 bg-linear-to-b from-white to-white/70 bg-clip-text font-heading text-[clamp(2.9rem,9.5vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-transparent"
        >
          Zezinho Automóveis
        </Pulled>
      </div>
      <div aria-hidden="true" className="absolute inset-x-4 top-[57%] text-center">
        <Pulled
          show={show}
          delay={0.08}
          className="-scale-y-100 bg-linear-to-t from-white/30 to-transparent bg-clip-text font-heading text-[clamp(2.9rem,9.5vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-transparent opacity-60 blur-[1.5px] [mask-image:linear-gradient(to_top,black,transparent_70%)]"
        >
          Zezinho Automóveis
        </Pulled>
      </div>

      {/* Convite para rolar até a busca */}
      <div className="absolute inset-x-4 bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+5rem)] flex justify-center sm:bottom-32">
        <ScrollCue show={show} delay={PULL_DELAY + PULL_DURATION * 0.75} />
      </div>

      {/* Barra de vidro achatada com a ação */}
      <div className="absolute inset-x-3 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center sm:bottom-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: pullEase, delay: PULL_DELAY + PULL_DURATION * 0.6 }}
          className="glass flex w-full max-w-md items-center justify-between gap-4 rounded-full py-1.5 pl-6 pr-1.5"
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
