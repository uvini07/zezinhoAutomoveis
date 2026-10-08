/**
 * Assinatura visual da marca: barras diagonais paralelas derivadas das
 * diagonais do símbolo Zezinho. Usada em separadores, placeholders,
 * loading e detalhes de seção.
 */
export default function SlashMark({ count = 3, className }) {
  const step = 9;
  const slant = 12;
  const width = (count - 1) * step + slant + 4;
  return (
    <svg
      viewBox={`0 0 ${width} 14`}
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: count }, (_, i) => {
        const x = i * step;
        return <polygon key={i} points={`${x + slant},0 ${x + slant + 4},0 ${x + 4},14 ${x},14`} />;
      })}
    </svg>
  );
}
