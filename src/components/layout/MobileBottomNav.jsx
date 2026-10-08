import { NavLink } from 'react-router';
import { CarFront, House, Search } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { useUI } from '@/context/UIContext';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import { cn } from '@/utils/cn';

const itemBase =
  'relative flex h-full w-full flex-col items-center justify-center gap-1 font-heading text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors';

function ActiveBar() {
  return <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[2px] bg-red" />;
}

/**
 * Navegação inferior fixa — só no mobile. O WhatsApp é o botão vermelho
 * "flutuante" que se destaca acima da barra.
 */
export default function MobileBottomNav() {
  const { openSearch, searchOpen } = useUI();

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-black/90 pb-safe backdrop-blur-xl lg:hidden"
    >
      <ul className="grid h-16 grid-cols-4">
        {[
          { to: '/', label: 'Início', Icon: House, end: true },
          { to: '/estoque', label: 'Estoque', Icon: CarFront },
        ].map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => cn(itemBase, isActive ? 'text-white' : 'text-gray hover:text-white')}
            >
              {({ isActive }) => (
                <>
                  {isActive && <ActiveBar />}
                  <Icon className="size-5" aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={openSearch}
            className={cn(itemBase, searchOpen ? 'text-white' : 'text-gray hover:text-white')}
            aria-haspopup="dialog"
          >
            {searchOpen && <ActiveBar />}
            <Search className="size-5" aria-hidden="true" />
            Buscar
          </button>
        </li>
        <li>
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(itemBase, 'text-white')}
            aria-label="Conversar no WhatsApp"
          >
            <span className="-mt-7 grid size-12 place-items-center rounded-sm bg-red shadow-glow ring-4 ring-black transition-transform active:scale-95">
              <WhatsAppIcon className="size-6" />
            </span>
            WhatsApp
          </a>
        </li>
      </ul>
    </nav>
  );
}
