import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import Navbar from '@/components/layout/Navbar';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import NavigationProgress from '@/components/layout/NavigationProgress';
import Footer from '@/components/layout/Footer';
import { UIProvider, useUI } from '@/context/UIContext';

function Shell() {
  const location = useLocation();
  const { closeMenu, closeSearch } = useUI();

  // Fecha menu e busca a cada troca de rota (só depende da URL)
  useEffect(() => {
    closeMenu();
    closeSearch();
  }, [location.pathname, location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-dvh flex-col bg-black">
      <a
        href="#conteudo"
        className="sr-only z-[100] rounded-sm bg-red px-4 py-3 font-heading text-sm font-semibold uppercase text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <NavigationProgress />
      <Navbar />
      <main id="conteudo" className="flex-1 [&>*:not(.full-bleed)]:pt-24">
        <Outlet />
      </main>
      <Footer />
      <MobileMenu />
      <SearchOverlay />
      <ScrollRestoration />
    </div>
  );
}

export default function Layout() {
  return (
    <UIProvider>
      <Shell />
    </UIProvider>
  );
}
