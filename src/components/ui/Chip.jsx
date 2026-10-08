import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Botão de seleção (toggle) usado nos filtros. Estado indicado por ícone + cor. */
export default function Chip({ selected, onClick, count, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-sm border px-3 text-[13px] font-medium transition-colors duration-200',
        selected
          ? 'border-red bg-red/15 text-white'
          : 'border-line-strong text-gray hover:border-white/35 hover:text-white',
      )}
    >
      {selected && <Check className="size-3.5 text-red-bright" aria-hidden="true" />}
      {children}
      {count != null && <span className="text-[11px] tnum text-gray-dim">{count}</span>}
    </button>
  );
}
