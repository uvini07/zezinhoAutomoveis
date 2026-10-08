import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const MICRO = ['Atendimento personalizado', 'Veículos selecionados', 'Showroom físico'];

/** Chamada final: fundo preto com uma diagonal vermelha atravessando a composição. */
export default function CTA() {
  return (
    <section aria-labelledby="cta-titulo" className="relative overflow-hidden border-t border-line bg-black py-section">
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60" />
      {/* Diagonal vermelha */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '30%', opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-[30%] top-[18%] h-28 w-[95%] -rotate-[28deg] bg-red sm:h-40 lg:-right-[12%] lg:top-1/2 lg:w-[70%] lg:-translate-y-1/2"
      >
        <div className="absolute inset-0 bg-hatch-red mix-blend-multiply" />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/10 lg:via-black/70"
      />

      <div className="shell relative">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-heading text-xs font-semibold tnum text-white">05</span>
            <span aria-hidden="true" className="h-px w-8 bg-red" />
            <span className="label-tech">Próximo passo</span>
          </div>
          <h2 id="cta-titulo" className="display mt-6 max-w-4xl text-[clamp(3.2rem,13vw,8.75rem)]">
            Encontre o carro
            <br />
            que combina com você.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button to="/estoque" variant="light" size="lg">
            Ver estoque
          </Button>
          <WhatsAppButton size="lg">Falar no WhatsApp</WhatsAppButton>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {MICRO.map((text) => (
              <li key={text} className="label-tech flex items-center gap-2.5 text-white/80">
                <span aria-hidden="true" className="size-1.5 bg-red" />
                {text}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
