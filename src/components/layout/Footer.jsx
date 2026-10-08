import { Link } from 'react-router';
import { Phone } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SlashMark from '@/components/ui/SlashMark';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { SITE, USE_MOCK_DATA } from '@/config/site';
import { generateWhatsAppLink } from '@/utils/whatsapp';

const linkClass = 'inline-flex min-h-10 items-center gap-2 text-sm text-gray transition-colors hover:text-white';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-black-2">
      <div aria-hidden="true" className="absolute inset-0 bg-hatch opacity-60" />
      <div className="shell relative grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link to="/" aria-label="Zezinho Automóveis — página inicial" className="inline-block rounded-xs">
            <Logo variant="stacked" className="w-24" />
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-gray">
            Veículos selecionados, procedência e atendimento especializado.
          </p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-3">
          <p className="label-tech mb-3 flex items-center gap-2">
            <SlashMark count={2} className="h-2.5 text-red" /> Navegação
          </p>
          <ul>
            <li><Link to="/estoque" className={linkClass}>Estoque</Link></li>
            <li><Link to="/#sobre" className={linkClass}>Sobre</Link></li>
            <li><Link to="/contato" className={linkClass}>Contato</Link></li>
            <li>
              <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </li>
            {SITE.instagramUrl && (
              <li>
                <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <InstagramIcon className="size-4" /> Instagram
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label-tech mb-3 flex items-center gap-2">
            <SlashMark count={2} className="h-2.5 text-red" /> Atendimento
          </p>
          <a href={SITE.phoneHref} className="font-heading text-2xl font-semibold tnum text-white transition-colors hover:text-red-bright">
            <Phone className="mr-2 inline size-5 align-[-2px] text-gray" aria-hidden="true" />
            {SITE.phone}
          </a>
          {SITE.address && <p className="mt-3 text-sm text-gray">{SITE.address}</p>}
          <p className="mt-3 text-sm text-gray">Fale com um consultor pelo WhatsApp ou visite nosso showroom.</p>
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="shell flex flex-col gap-1 py-5 text-xs text-gray sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Zezinho Automóveis. Todos os direitos reservados.</p>
          {USE_MOCK_DATA && <p>Estoque exibido com dados demonstrativos.</p>}
        </div>
      </div>
    </footer>
  );
}
