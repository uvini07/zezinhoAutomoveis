import { WHATSAPP_NUMBER, SITE } from '@/config/site';
import { getVehicleFullName, getVehicleUrl, formatPrice } from '@/utils/vehicleUtils';

const DEFAULT_MESSAGE =
  'Olá! Vim pelo site da Zezinho Automóveis e gostaria de falar com um consultor.';

function getOrigin() {
  return typeof window !== 'undefined' ? window.location.origin : SITE.url;
}

/** Mensagem automática para um veículo específico. */
export function getVehicleMessage(vehicle) {
  return [
    `Olá! Tenho interesse no ${getVehicleFullName(vehicle)} ${vehicle.year} anunciado no site da Zezinho Automóveis.`,
    `Valor anunciado: ${formatPrice(vehicle.price)}`,
    `${getOrigin()}${getVehicleUrl(vehicle)}`,
  ].join('\n');
}

/** Monta um link wa.me com texto pronto. Sem número configurado, o usuário escolhe o contato. */
export function buildWhatsAppUrl(text) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}

/**
 * Link do WhatsApp com mensagem automática.
 * - generateWhatsAppLink()            → contato geral
 * - generateWhatsAppLink(vehicle)     → interesse no veículo
 * - generateWhatsAppLink(null, texto) → mensagem personalizada
 */
export function generateWhatsAppLink(vehicle, customMessage) {
  const text = customMessage ?? (vehicle ? getVehicleMessage(vehicle) : DEFAULT_MESSAGE);
  return buildWhatsAppUrl(text);
}
