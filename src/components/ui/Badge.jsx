import { cn } from '@/utils/cn';

const VARIANTS = {
  red: 'bg-red/90 text-white backdrop-blur-md',
  outline: 'border border-white/20 bg-white/10 text-white backdrop-blur-md',
};

export default function Badge({ variant = 'red', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium leading-none',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
