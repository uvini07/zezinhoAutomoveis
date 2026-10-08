import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Select nativo estilizado — no celular abre o seletor do sistema. */
const SelectField = forwardRef(function SelectField(
  { label, hideLabel = false, icon: Icon, className, selectClassName, children, ...props },
  ref,
) {
  return (
    <label className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <span className={cn('label-tech', hideLabel && 'sr-only')}>{label}</span>
      <span className="relative block">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray" aria-hidden="true" />
        )}
        <select
          ref={ref}
          className={cn(
            'h-11 w-full truncate rounded-sm border border-line-strong bg-graphite pr-9 text-sm text-white transition-colors',
            'hover:border-white/30 focus-visible:border-red',
            Icon ? 'pl-9' : 'pl-3',
            selectClassName,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray"
          aria-hidden="true"
        />
      </span>
    </label>
  );
});

export default SelectField;
