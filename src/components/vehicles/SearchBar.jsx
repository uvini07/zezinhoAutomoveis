import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Campo de busca com estado local + debounce: digitar fica fluido e a URL
 * só é atualizada quando o usuário pausa.
 */
export default function SearchBar({ value, onChange, placeholder = 'Buscar marca, modelo, versão…', className }) {
  const [text, setText] = useState(value);
  const lastSent = useRef(value);

  // Mudança externa (ex.: "limpar filtros", link de busca)
  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    if (text === lastSent.current) return undefined;
    const timer = setTimeout(() => {
      lastSent.current = text;
      onChange(text);
    }, 220);
    return () => clearTimeout(timer);
  }, [text, onChange]);

  return (
    <form role="search" className={cn('relative', className)} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="busca-estoque" className="sr-only">
        Buscar no estoque
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-gray" aria-hidden="true" />
      <input
        id="busca-estoque"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-sm border border-line-strong bg-graphite pl-11 pr-12 text-[15px] text-white placeholder:text-gray-dim transition-colors hover:border-white/30 focus-visible:border-red"
      />
      {text && (
        <button
          type="button"
          onClick={() => setText('')}
          className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-gray transition-colors hover:text-white"
          aria-label="Limpar busca"
        >
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
