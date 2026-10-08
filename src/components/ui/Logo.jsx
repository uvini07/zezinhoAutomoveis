import { cn } from '@/utils/cn';

/**
 * Logotipo oficial (arquivos recortados do logo enviado, sem redesenho).
 * - horizontal: símbolo + wordmark lado a lado (header)
 * - stacked: lockup original empilhado (rodapé)
 */
export default function Logo({ variant = 'horizontal', className }) {
  if (variant === 'stacked') {
    return (
      <img
        src="/img/logo-zezinho.webp"
        alt="Zezinho Automóveis"
        width="236"
        height="279"
        className={cn('h-auto w-28', className)}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img src="/img/logo-simbolo.webp" alt="" width="207" height="195" className="h-9 w-auto" />
      <img
        src="/img/logo-wordmark.webp"
        alt="Zezinho Automóveis"
        width="234"
        height="77"
        className="h-[30px] w-auto"
      />
    </span>
  );
}
