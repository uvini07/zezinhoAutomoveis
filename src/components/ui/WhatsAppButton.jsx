import Button from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/BrandIcons';
import { generateWhatsAppLink } from '@/utils/whatsapp';

/**
 * CTA de WhatsApp. Sem `vehicle` → mensagem de contato geral;
 * com `vehicle` → mensagem automática de interesse no veículo.
 */
export default function WhatsAppButton({
  vehicle,
  message,
  children = 'Falar no WhatsApp',
  variant = 'secondary',
  ...props
}) {
  return (
    <Button
      href={generateWhatsAppLink(vehicle, message)}
      variant={variant}
      iconLeft={WhatsAppIcon}
      icon={null}
      {...props}
    >
      {children}
    </Button>
  );
}
