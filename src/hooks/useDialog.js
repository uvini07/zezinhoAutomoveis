import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

function lockScroll() {
  lockCount += 1;
  if (lockCount === 1) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (scrollbar > 0) document.documentElement.style.paddingRight = `${scrollbar}px`;
  }
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = '';
    document.documentElement.style.paddingRight = '';
  }
}

/**
 * Acessibilidade de diálogos (menu, drawer de filtros, busca):
 * trava o scroll, foca o primeiro elemento, prende o Tab dentro,
 * fecha com Esc e devolve o foco a quem abriu.
 */
export function useDialog(open, onClose, { initialFocus } = {}) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    lockScroll();

    const frame = requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      const target = (initialFocus && node.querySelector(initialFocus)) || node.querySelector(FOCUSABLE);
      (target ?? node).focus({ preventScroll: true });
    });

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !ref.current) return;
      const items = [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      unlockScroll();
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, initialFocus]);

  return ref;
}
