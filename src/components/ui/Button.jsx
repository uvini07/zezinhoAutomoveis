import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary:
    'bg-red text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] hover:bg-red-bright hover:shadow-glow',
  secondary: 'glass glass-hover text-white',
  light: 'bg-white text-black hover:bg-white/90',
  ghost: 'text-white hover:text-white/75',
};

const SIZES = {
  sm: 'h-10 gap-2 px-4 text-sm',
  md: 'h-12 gap-2.5 px-5 text-[15px]',
  lg: 'h-13 gap-2.5 px-6 text-[15px]',
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
    'group/btn relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full font-medium',
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
