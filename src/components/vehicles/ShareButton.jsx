import { useState } from 'react';
import { Check, Share } from 'lucide-react';

/** Compartilhar: menu nativo no celular, copiar link no desktop. */
export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        /* usuário cancelou */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copie o link do veículo:', url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm text-xs font-semibold uppercase tracking-[0.14em] text-gray transition-colors hover:text-white font-heading"
    >
      {copied ? <Check className="size-4 text-red-bright" aria-hidden="true" /> : <Share className="size-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Link copiado' : 'Compartilhar veículo'}</span>
    </button>
  );
}
