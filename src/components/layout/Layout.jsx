import { useEffect } from 'react';
import { Outlet, ScrollRestoration, matchPath, useLocation } from 'react-router';
import Navbar from '@/components/layout/Navbar';
import MobileMenu from '@/components/layout/MobileMenu';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import SearchOverlay from '@/components/layout/SearchOverlay';
import NavigationProgress from '@/components/layout/NavigationProgress';
import Footer from '@/components/layout/Footer';
import { UIProvider, useUI } from '@/context/UIContext';

function Shell() {
  const location = useLocation();
  const { closeMenu, closeSearch } = useUI();
  // Na página do veículo a barra inferior dá lugar ao CTA fixo do carro
  const isVehiclePage = Boolean(matchPath('/veiculos/:slug', location.pathname));

  // Fecha menu e busca a cada troca de rota (só depende da URL)
  useEffect(() => {
    closeMenu();
    closeSearch();
  }, [location.pathname, location.hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(var(--spacing-bottom-nav)+env(safe-area-inset-bottom))] lg:pb-0">
      <a
        href="#conteudo"
        className="sr-only z-[100] rounded-sm bg-red px-4 py-3 font-heading text-sm font-semibold uppercase text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <div aria-hidden="true" className="grain" />
      <NavigationProgress />
      <Navbar />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {!isVehiclePage && <MobileBottomNav />}
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
