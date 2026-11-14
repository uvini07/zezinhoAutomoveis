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
        {eyebrow && <p className="label-tech mb-3">{eyebrow}</p>}
        <Heading id={id} className="display text-[clamp(2.25rem,6vw,3.75rem)] text-white">
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
