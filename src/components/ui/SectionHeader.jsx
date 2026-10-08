import { cn } from '@/utils/cn';
import Reveal from '@/components/ui/Reveal';

/**
 * Cabeçalho editorial de seção:  02 ── DESTAQUES
 *                                 TÍTULO GRANDE
 */
export default function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
  id,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <Reveal className="max-w-4xl">
        <div className="mb-5 flex items-center gap-3">
          {index && <span className="font-heading text-xs font-semibold tnum text-white">{index}</span>}
          <span aria-hidden="true" className="h-px w-8 bg-red" />
          <span className="label-tech">{eyebrow}</span>
        </div>
        <Heading id={id} className="display text-[clamp(2.75rem,10vw,5.75rem)] text-white">
          {title}
        </Heading>
        {description && <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-gray">{description}</p>}
      </Reveal>
      {action && (
        <Reveal delay={0.1} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}
