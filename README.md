# Zezinho Automóveis — Showroom digital

Site da Zezinho Automóveis em **React + Vite + Tailwind CSS v4 + Framer Motion**, mobile-first.

## Rodar o projeto

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera a versão de produção em dist/
```

## Onde mexer

| O que | Arquivo |
| --- | --- |
| Número do WhatsApp, telefone, Instagram, endereço | `src/config/site.js` |
| Estoque (hoje **dados MOCK**) | `src/data/vehicles.js` |
| Origem dos dados (trocar mock por API/planilha) | `src/services/vehicles.js` |
| Cores, fontes, raios, sombras (design tokens) | `src/styles/index.css` (`@theme`) |
| Mensagem automática do WhatsApp | `src/utils/whatsapp.js` → `generateWhatsAppLink(vehicle)` |

### WhatsApp

Preencha `WHATSAPP_NUMBER` em `src/config/site.js` só com dígitos (DDI + DDD + número, ex.: `5511999998888`).
Enquanto estiver vazio, os botões abrem o WhatsApp com a mensagem pronta e a pessoa escolhe o contato.

### Fotos dos veículos

Todos os veículos começam com `image: null` e `images: []`, o que exibe o placeholder premium nos cards
e o banner "Veículo em preparação" na página do carro. Para publicar as fotos:

1. Coloque os arquivos em `public/img/veiculos/<slug-do-carro>/` (de preferência **WebP** ou **AVIF**, ~1600 px de largura, proporção 4:3).
2. Preencha no veículo:

```js
image: '/img/veiculos/bmw-320i-m-sport-2023/capa.webp',   // capa do card
images: [                                                  // galeria (carrossel)
  '/img/veiculos/bmw-320i-m-sport-2023/01.webp',
  '/img/veiculos/bmw-320i-m-sport-2023/02.webp',
],
```

Nada no layout precisa mudar.

### Dados mock

`src/data/vehicles.js` contém 12 veículos **fictícios**, só para demonstrar a interface. Antes de publicar,
substitua-os pelo estoque real e mude `USE_MOCK_DATA` para `false` em `src/config/site.js` (isso remove o aviso
"dados demonstrativos" do rodapé).

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Home (hero, destaques, carrocerias, sobre, CTA) |
| `/estoque` | Catálogo com busca, filtros e ordenação (estado salvo na URL, ex. `/estoque?carroceria=SUV&ordem=menor-preco`) |
| `/veiculos/:slug` | Detalhes do veículo |
| `/contato` | Canais + formulário que monta a mensagem no WhatsApp (`/contato?veiculo=<slug>` pré-seleciona o carro) |

## Estrutura

```
src/
  components/
    home/       Hero, StatsStrip, FeaturedCarousel, CategoryShowcase, WhySection, CTA
    layout/     Layout, Navbar, MobileMenu, MobileBottomNav, SearchOverlay, Footer
    ui/         Button, Badge, SectionHeader, WhatsAppButton, Logo, SlashMark, BottomSheet…
    vehicles/   VehicleCard, VehicleGrid, VehicleFilters, VehicleGallery, SkeletonVehicleImage…
  config/       site.js
  data/         vehicles.js (MOCK)
  hooks/        useVehicles, useVehicleFilters, useDialog, useDocumentMeta
  pages/        Home, Catalog, VehicleDetails, Contact, NotFound
  services/     vehicles.js
  utils/        vehicleUtils.js, whatsapp.js
public/img/     logo recortada (transparente), fachada da loja, banner "em preparação", favicon, og-image
```

## Publicação

É uma SPA: configure o servidor para responder `index.html` em qualquer rota
(Vercel e Netlify fazem isso com uma regra de *rewrite* para `/index.html`).
