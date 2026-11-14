import { useCallback, useEffect, useRef } from 'react';

/**
 * Brilho que segue o mouse por um grupo de cartões.
 * Passe `ref` e `onPointerMove` ao contêiner (classe `glow-grid`) e marque
 * cada cartão com `glow-card`. A posição do cursor vira as variáveis CSS
 * --mx/--my em cada cartão (e no contêiner), sem re-renderizar o React.
 */
export function useGlowGrid() {
  const ref = useRef(null);
  const frame = useRef(0);

  const onPointerMove = useCallback((event) => {
    if (event.pointerType === 'touch') return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const root = ref.current;
      if (!root) return;
      const box = root.getBoundingClientRect();
      root.style.setProperty('--mx', `${clientX - box.left}px`);
      root.style.setProperty('--my', `${clientY - box.top}px`);
      root.querySelectorAll('.glow-card').forEach((card) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${clientX - r.left}px`);
        card.style.setProperty('--my', `${clientY - r.top}px`);
      });
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { ref, onPointerMove };
}
