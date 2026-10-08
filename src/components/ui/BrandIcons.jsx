/* Ícones de marca no mesmo traço do Lucide (que não inclui logos de marcas). */

export function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.4 20.6 4.7 16.4A8.7 8.7 0 1 1 7.9 19.4Z" />
      <path
        fill="currentColor"
        stroke="none"
        d="M9.2 7.6c.3 0 .5 0 .7.4l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.3 0 .5.7 1.2 1.6 2.1 2.8 2.7.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .6-.3 1.3-.9 1.6-.6.3-1.6.5-3-.1a10 10 0 0 1-4.6-4.3c-.7-1.3-.8-2.4-.3-3.3.3-.6.7-.9 1.1-1.2Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
