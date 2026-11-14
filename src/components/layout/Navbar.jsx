import { Link } from 'react-router';
import Logo from '@/components/ui/Logo';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { generateWhatsAppLink } from '@/utils/whatsapp';

/** Barra flutuante em vidro: logo, dois links e WhatsApp. */
export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="glass pointer-events-auto mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full pl-5 pr-2">
        <Link to="/" aria-label="Zezinho Automóveis — página inicial" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <Link
            to="/estoque"
            className="hidden rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:block"
          >
            Estoque
          </Link>
          <Link
            to="/contato"
            className="hidden rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:block"
          >
            Contato
          </Link>
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-red px-4 text-sm font-medium text-white transition-colors hover:bg-red-bright"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}

export function isLinkActive(link, location) {
  if (link.to.includes('#')) return location.pathname === '/' && location.hash === link.to.slice(1);
  return location.pathname.startsWith(link.to);
}
