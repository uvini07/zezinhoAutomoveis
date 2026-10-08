import SlashMark from '@/components/ui/SlashMark';
import { cn } from '@/utils/cn';

const corner = 'absolute size-3 border-white/20';

/**
 * Placeholder premium para veículos sem foto.
 * Cinza escuro com gradiente, grid técnico e shimmer discreto — parece
 * parte do design, não um skeleton de app. Preenche o pai (absolute inset-0),
 * então a proporção é definida por quem o usa (16:10 nos cards).
 */
export default function SkeletonVehicleImage({ label = 'Fotos em preparação', compact = false, className }) {
  return (
    <div role="img" aria-label={label} className={cn('skeleton-surface absolute inset-0', className)}>
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-70" />
      <SlashMark
        count={3}
        className="absolute -bottom-[6%] -right-[4%] h-[62%] text-white/[0.035]"
      />

      {!compact && (
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <SlashMark className="h-4 text-white/25" />
            <span className="font-heading text-[10px] font-medium uppercase tracking-[0.28em] text-white/45">
              {label}
            </span>
          </div>
        </div>
      )}

      <span aria-hidden="true" className={cn(corner, 'left-3 top-3 border-l border-t')} />
      <span aria-hidden="true" className={cn(corner, 'right-3 top-3 border-r border-t')} />
      <span aria-hidden="true" className={cn(corner, 'bottom-3 left-3 border-b border-l')} />
      <span aria-hidden="true" className="absolute bottom-3 right-3 size-2 bg-red" />
    </div>
  );
}
