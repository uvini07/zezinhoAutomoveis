import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UIContext = createContext(null);

/** Estado global de interface: menu mobile e busca rápida (overlay). */
export function UIProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Atalhos de teclado: "/" ou Ctrl/Cmd+K abrem a busca
  useEffect(() => {
    function onKeyDown(event) {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      menuOpen,
      openMenu: () => setMenuOpen(true),
      closeMenu: () => setMenuOpen(false),
      searchOpen,
      openSearch: () => {
        setMenuOpen(false);
        setSearchOpen(true);
      },
      closeSearch: () => setSearchOpen(false),
    }),
    [menuOpen, searchOpen],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI precisa estar dentro de <UIProvider>');
  return ctx;
}
