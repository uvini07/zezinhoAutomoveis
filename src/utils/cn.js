/** Junta classes condicionais: cn('a', cond && 'b') → "a b". */
export const cn = (...classes) => classes.filter(Boolean).join(' ');
