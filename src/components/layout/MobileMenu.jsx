import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Phone, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SlashMark from '@/components/ui/SlashMark';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { isLinkActive } from '@/components/layout/Navbar';
import { useUI } from '@/context/UIContext';
import { useDialog } from '@/hooks/useDialog';
import { NAV_LINKS, SITE } from '@/config/site';
import { cn } from '@/utils/cn';
import { pad2 } from '@/utils/vehicleUtils';

/** Menu mobile em tela cheia com links grandes numerados. */
export default function MobileMenu() {
  const { menuOpen, closeMenu } = useUI();
  const location = useLocation();
  const ref = useDialog(menuOpen, closeMenu);

  return (
    <AnimatePresence>
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            aria-hidden="true"
          />
          <motion.div
            ref={ref}
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto overscroll-contain border-l border-line bg-black-2"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 36, stiffness: 340 }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
            <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-line px-gutter">
              <Logo />
              <button
                type="button"
                onClick={closeMenu}
                className="grid size-11 place-items-center rounded-sm border border-line-strong text-white"
                aria-label="Fechar menu"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Menu principal" className="relative flex-1 px-gutter py-8">
              <p className="label-tech mb-4">Navegação</p>
              <ul>
                {[{ label: 'Início', to: '/' }, ...NAV_LINKS].map((link, i) => {
                  const active = link.to === '/' ? location.pathname === '/' && !location.hash : isLinkActive(link, location);
                  return (
                    <motion.li
                      key={link.to}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-line"
                    >
                      <Link
                        to={link.to}
                        onClick={closeMenu}
                        aria-current={active ? 'page' : undefined}
                        className="group flex items-center gap-4 py-4"
                      >
                        <span className={cn('font-heading text-xs font-semibold tnum', active ? 'text-red-bright' : 'text-gray')}>
                          {pad2(i + 1)}
                        </span>
                        <span className="display flex-1 text-5xl text-white">{link.label}</span>
                        <ArrowUpRight
                          className="size-6 text-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                          aria-hidden="true"
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="relative space-y-4 border-t border-line px-gutter py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <WhatsAppButton variant="primary" size="lg" fullWidth>
                Falar com um consultor
              </WhatsAppButton>
              <a
                href={SITE.phoneHref}
                className="flex h-12 items-center justify-center gap-2 text-sm text-gray transition-colors hover:text-white"
              >
                <Phone className="size-4" aria-hidden="true" />
                {SITE.phone}
              </a>
              <div className="flex items-center justify-center gap-3 pt-2">
                <SlashMark className="h-3 text-red" />
                <span className="label-tech">Zezinho Automóveis</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
