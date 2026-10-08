import { RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import SlashMark from '@/components/ui/SlashMark';

/** Nenhum resultado: oferece limpar filtros ou pedir ajuda a um consultor. */
export default function EmptyState({ onClear }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-graphite px-6 py-14 text-center">
      <div aria-hidden="true" className="absolute inset-0 bg-hatch" />
      <div className="relative mx-auto max-w-md">
        <SlashMark className="mx-auto h-5 text-red" />
        <h2 className="mt-6 font-heading text-2xl font-semibold uppercase tracking-wide">Nenhum veículo encontrado</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-gray">
          Não encontramos carros com essa combinação. Ajuste os filtros ou conte para um consultor o que você
          procura — a gente ajuda a encontrar.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="secondary" onClick={onClear} icon={RotateCcw}>
            Limpar filtros
          </Button>
          <WhatsAppButton
            variant="primary"
            message="Olá! Não encontrei no site o carro que procuro. Podem me ajudar?"
          >
            Falar com consultor
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
