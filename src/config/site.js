/**
 * CONFIGURAÇÃO CENTRAL — Zezinho Automóveis
 * Todos os dados de contato e flags do site ficam aqui. Nada de números
 * espalhados pelo projeto.
 */

/**
 * Número do WhatsApp comercial: apenas dígitos, com DDI + DDD.
 * Ex.: '5511999998888'
 *
 * Enquanto estiver vazio, os links abrem o WhatsApp com a mensagem pronta
 * para o usuário escolher o contato (wa.me/?text=...).
 */
export const WHATSAPP_NUMBER = '5511940208218';

export const SITE = {
  name: 'Zezinho Automóveis',
  title: 'Zezinho Automóveis | Veículos Selecionados',
  description:
    'Encontre seu próximo carro na Zezinho Automóveis. Confira nosso estoque de veículos e fale com nossa equipe.',
  // Domínio e telefone exibidos na fachada da loja — confirmar antes de publicar.
  url: 'https://www.zezinhoauto.com.br',
  phone: '(11) 4448-4568',
  phoneHref: 'tel:+551144484568',
  // Preencha para exibir no rodapé e na página de contato.
  instagramUrl: '',
  address: '',
};

/** Navegação principal (desktop + menu mobile). */
export const NAV_LINKS = [
  { label: 'Estoque', to: '/estoque' },
  { label: 'Sobre', to: '/#sobre' },
  { label: 'Contato', to: '/contato' },
];

/**
 * Dados de estoque: enquanto `true`, o site usa os veículos MOCK de
 * src/data/vehicles.js e exibe um aviso discreto no rodapé.
 */
export const USE_MOCK_DATA = false;

/** Latência simulada do "fetch" local (0 = imediato). Útil para testar os estados de loading. */
export const MOCK_LATENCY_MS = 0;

/** Imagem exibida na galeria do veículo enquanto não houver fotos. */
export const VEHICLE_PLACEHOLDER_IMAGE = '/img/veiculo-em-preparacao.webp';
