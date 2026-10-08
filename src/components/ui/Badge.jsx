import { cn } from '@/utils/cn';

const VARIANTS = {
  red: 'bg-red text-white',
  outline: 'border border-line-strong bg-black/60 text-white backdrop-blur-sm',
};

export default function Badge({ variant = 'red', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-xs px-2 font-heading text-[10px] font-semibold uppercase leading-none tracking-[0.18em]',
        VARIANTS[variant],
        className,
      )}
    >
      <span aria-hidden="true" className="h-2.5 w-[3px] -skew-x-[30deg] bg-current opacity-70" />
      {children}
    </span>
  );
}
