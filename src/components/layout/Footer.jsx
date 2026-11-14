import { Link } from 'react-router';
import { SITE } from '@/config/site';
import { generateWhatsAppLink } from '@/utils/whatsapp';

/** Rodapé mínimo em vidro. */
export default function Footer() {
  return (
    <footer className="px-3 pb-6 pt-16 sm:px-6">
      <div className="glass mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 rounded-3xl px-6 py-5 text-sm text-white/60 sm:flex-row">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <nav aria-label="Rodapé" className="flex items-center gap-5">
          <Link to="/estoque" className="transition-colors hover:text-white">Estoque</Link>
          <Link to="/contato" className="transition-colors hover:text-white">Contato</Link>
          <a href={SITE.phoneHref} className="transition-colors hover:text-white">{SITE.phone}</a>
          <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
