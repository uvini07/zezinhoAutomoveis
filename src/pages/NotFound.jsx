import Button from '@/components/ui/Button';
import PageTransition from '@/components/ui/PageTransition';
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
      <section className="shell grid min-h-[70svh] place-items-center py-section">
        <div className="glass w-full max-w-xl rounded-[2rem] px-6 py-12 text-center sm:px-10">
          <p className="display text-[clamp(4rem,16vw,7rem)] text-white/15">{copy.code}</p>
          <h1 className="display mt-2 text-[clamp(2rem,6vw,3rem)]">{copy.title}</h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray">{copy.text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
