import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
import SlashMark from '@/components/ui/SlashMark';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

const COPY = {
  page: {
    code: '404',
    title: 'Fora da pista.',
    text: 'A página que você procura não existe ou mudou de endereço.',
  },
  vehicle: {
    code: 'Vendido?',
    title: 'Veículo não encontrado.',
    text: 'Este anúncio não está mais disponível. Ele pode ter sido vendido — confira o estoque atualizado.',
  },
};

export default function NotFound({ variant = 'page' }) {
  const copy = COPY[variant];
  useDocumentMeta({ title: variant === 'vehicle' ? 'Veículo não encontrado' : 'Página não encontrada' });

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="shell relative py-section">
          <SlashMark className="h-6 text-red" />
          <p className="display mt-8 text-[clamp(5rem,26vw,14rem)] text-white/10">{copy.code}</p>
          <h1 className="display -mt-[0.35em] text-[clamp(3rem,12vw,6.5rem)]">{copy.title}</h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-gray">{copy.text}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to="/estoque" size="lg">
              Ver estoque
            </Button>
            <WhatsAppButton size="lg">Falar com consultor</WhatsAppButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
