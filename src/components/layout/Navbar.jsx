import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { useUI } from '@/context/UIContext';
import { NAV_LINKS } from '@/config/site';
import { cn } from '@/utils/cn';

export function isLinkActive(link, location) {
  if (link.to.includes('#')) return location.pathname === '/' && location.hash === link.to.slice(1);
  return location.pathname.startsWith(link.to);
}

/**
 * Header sticky: preto translúcido com blur. Ao rolar, fica mais opaco,
 * ganha borda e (no desktop) reduz a altura. A linha vermelha inferior
 * acompanha o progresso de leitura da página.
 */
export default function Navbar() {
  const location = useLocation();
  const { openSearch, openMenu, menuOpen } = useUI();
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,border-color] duration-500',
        scrolled ? 'border-line bg-black/85 backdrop-blur-xl' : 'border-transparent bg-black/50 backdrop-blur-md',
      )}
    >
      <div
        className={cn(
          'shell flex items-center justify-between gap-6 transition-[height] duration-500 ease-race',
          scrolled ? 'h-16' : 'h-16 lg:h-20',
        )}
      >
        <Link to="/" aria-label="Zezinho Automóveis — página inicial" className="shrink-0 rounded-xs">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link, location);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex h-11 items-center px-4 font-heading text-xs font-semibold uppercase tracking-[0.16em] transition-colors',
                      active ? 'text-white' : 'text-gray hover:text-white',
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 bottom-1.5 h-[2px] bg-red"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="hidden h-10 items-center gap-3 rounded-sm border border-line-strong px-3 text-gray transition-colors hover:border-white/35 hover:text-white lg:inline-flex"
            aria-label="Buscar veículos (atalho: /)"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em]">Buscar</span>
          </button>
          <div className="hidden lg:block">
            <WhatsAppButton variant="primary" size="sm">
              WhatsApp
            </WhatsAppButton>
          </div>
          <button
            type="button"
            onClick={openMenu}
            className="grid size-11 place-items-center rounded-sm border border-line-strong text-white transition-colors hover:border-white/40 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-red"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
