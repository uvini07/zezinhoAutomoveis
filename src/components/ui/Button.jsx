import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary:
    'bg-red text-white hover:bg-red-bright hover:shadow-glow',
  secondary:
    'border border-line-strong bg-white/[0.03] text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/[0.07]',
  light: 'bg-white text-black hover:bg-white/90',
  ghost: 'text-white hover:text-white/75',
};

const SIZES = {
  sm: 'h-10 gap-2 px-4 text-[11px]',
  md: 'h-12 gap-3 px-5 text-xs',
  lg: 'h-14 gap-3 px-6 text-[13px]',
};

/**
 * Botão polimórfico: <button>, <Link to> (rota interna) ou <a href> (externo).
 * A seta desliza para a direita no hover — microinteração padrão do site.
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon = ArrowRight,
  iconLeft: IconLeft,
  fullWidth = false,
  className,
  children,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'group/btn relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-sm font-heading font-semibold uppercase tracking-[0.14em]',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-race active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-40',
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {IconLeft && <IconLeft className="size-[18px] shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && (
        <Icon
          className="size-4 shrink-0 transition-transform duration-300 ease-race group-hover/btn:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}
