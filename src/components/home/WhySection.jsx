import { motion } from 'framer-motion';
import { Crosshair, FileCheck, Handshake, ShieldCheck } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import SlashMark from '@/components/ui/SlashMark';
import { pad2 } from '@/utils/vehicleUtils';

const DIFERENCIAIS = [
  { icon: ShieldCheck, title: 'Procedência', text: 'Veículos selecionados com atenção aos detalhes.' },
  { icon: FileCheck, title: 'Transparência', text: 'Informações claras para você comprar com segurança.' },
  { icon: Handshake, title: 'Atendimento', text: 'Atendimento próximo e especializado.' },
  { icon: Crosshair, title: 'Seleção', text: 'Um estoque escolhido pensando em qualidade.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** "Por que Zezinho" — seção institucional curta (âncora #sobre). */
export default function WhySection() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      className="relative scroll-mt-16 overflow-hidden border-t border-line bg-black-2 py-section"
    >
      <SlashMark
        count={3}
        className="pointer-events-none absolute -right-16 top-1/2 h-[70%] -translate-y-1/2 text-white/[0.025]"
      />
      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeader
          id="sobre-titulo"
          className="lg:col-span-5"
          index="04"
          eyebrow="Por que a Zezinho"
          title={
            <>
              Não é só um carro.
              <br />
              <span className="text-gray">É o seu próximo carro.</span>
            </>
          }
          description="Uma loja feita por quem gosta de carro, para quem gosta de dirigir. Do primeiro contato à entrega das chaves, você conversa com quem entende do assunto."
        />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          className="grid gap-px self-end overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:col-span-7"
        >
          {DIFERENCIAIS.map(({ icon: Icon, title, text }, i) => (
            <motion.li key={title} variants={item} className="group relative bg-black-2 p-6 sm:p-8">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-[2px] w-0 bg-red transition-[width] duration-500 ease-race group-hover:w-full"
              />
              <div className="flex items-center justify-between">
                <Icon className="size-7 text-red-bright" strokeWidth={1.5} aria-hidden="true" />
                <span className="font-heading text-xs font-semibold tnum text-gray-dim">{pad2(i + 1)}</span>
              </div>
              <h3 className="mt-8 font-heading text-xl font-semibold uppercase tracking-wide">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray">{text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
