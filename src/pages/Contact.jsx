import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { ArrowUpRight, CircleAlert, CircleCheck, Phone, Send } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import SelectField from '@/components/ui/SelectField';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { useVehicles } from '@/hooks/useVehicles';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { SITE } from '@/config/site';
import { buildWhatsAppUrl, generateWhatsAppLink } from '@/utils/whatsapp';
import { cn } from '@/utils/cn';
import { findVehicle, formatPrice, getVehicleFullName, getVehicleSlug, sortVehicles } from '@/utils/vehicleUtils';

/** (11) 98765-4321 */
function formatPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const inputClass =
  'h-12 w-full rounded-2xl border bg-graphite px-4 text-[15px] text-white placeholder:text-gray-dim transition-colors hover:border-white/30 focus-visible:border-red';

function Field({ id, label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label-tech flex justify-between text-white/80">
        {label}
        {optional && <span className="text-gray-dim">opcional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1.5 text-[13px] text-white">
          <CircleAlert className="size-3.5 shrink-0 text-red-bright" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function buildMessage(data, vehicle) {
  return [
    `Olá! Meu nome é ${data.name.trim()}.`,
    vehicle
      ? `Tenho interesse no ${getVehicleFullName(vehicle)} ${vehicle.year} (${formatPrice(vehicle.price)}) anunciado no site da Zezinho Automóveis.`
      : 'Vim pelo site da Zezinho Automóveis e gostaria de falar com um consultor.',
    data.message?.trim() && `Mensagem: ${data.message.trim()}`,
    `Telefone: ${data.phone}`,
    data.email?.trim() && `E-mail: ${data.email.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export default function Contact() {
  useDocumentMeta({
    title: 'Contato',
    description: 'Fale com um consultor da Zezinho Automóveis pelo WhatsApp, telefone ou formulário.',
    path: '/contato',
  });

  const [params] = useSearchParams();
  const { vehicles, isLoading } = useVehicles();
  const [sentUrl, setSentUrl] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', phone: '', email: '', vehicle: '', message: '' },
  });

  // Pré-seleciona o veículo vindo de "Tenho interesse" (?veiculo=slug)
  useEffect(() => {
    const slug = params.get('veiculo');
    if (!isLoading && slug && findVehicle(vehicles, slug)) setValue('vehicle', slug);
  }, [isLoading, vehicles, params, setValue]);

  const phoneField = register('phone', {
    required: 'Informe um telefone para contato.',
    validate: (v) => [10, 11].includes(v.replace(/\D/g, '').length) || 'Telefone incompleto. Ex.: (11) 98765-4321',
  });

  function onSubmit(data) {
    const url = buildWhatsAppUrl(buildMessage(data, findVehicle(vehicles, data.vehicle)));
    setSentUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const describedBy = (name) => (errors[name] ? `${name}-erro` : undefined);

  const channels = [
    {
      href: generateWhatsAppLink(),
      external: true,
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: 'Falar com um consultor',
      primary: true,
    },
    { href: SITE.phoneHref, icon: Phone, label: 'Telefone', value: SITE.phone },
    SITE.instagramUrl && {
      href: SITE.instagramUrl,
      external: true,
      icon: InstagramIcon,
      label: 'Instagram',
      value: 'Acompanhe as novidades',
    },
  ].filter(Boolean);

  return (
    <PageTransition>
      <section aria-labelledby="contato-titulo">
        <div className="shell pb-8 pt-6 lg:pb-10 lg:pt-12">
          <h1 id="contato-titulo" className="display text-[clamp(2.75rem,8vw,5rem)]">
            Contato
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray sm:text-base">
            Dúvidas sobre um veículo, proposta de troca ou agendamento de visita: escolha o canal que preferir.
          </p>
        </div>
      </section>

      <div className="shell grid gap-6 pb-section lg:grid-cols-12 lg:gap-8">
        {/* Canais */}
        <Reveal className="space-y-4 lg:col-span-5">
          {channels.map(({ href, external, icon: Icon, label, value, primary }) => (
            <a
              key={label}
              href={href}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              className={cn(
                'glass glass-hover group flex items-center gap-4 rounded-3xl p-4',
                primary && 'border-red/50',
              )}
            >
              <span
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-full',
                  primary ? 'bg-red text-white' : 'bg-white/10 text-white',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="label-tech block">{label}</span>
                <span className="block truncate font-heading text-base font-semibold text-white">{value}</span>
              </span>
              <ArrowUpRight
                className="size-5 text-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                aria-hidden="true"
              />
            </a>
          ))}

          <figure className="relative mt-2 aspect-[16/10] overflow-hidden rounded-3xl border border-white/15">
            <picture>
              <source srcSet="/img/loja-fachada.avif" type="image/avif" />
              <source srcSet="/img/loja-fachada.webp" type="image/webp" />
              <img
                src="/img/loja-fachada.jpg"
                alt="Fachada do showroom da Zezinho Automóveis"
                width="1024"
                height="768"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4">
              <span className="label-tech text-white">
                Nosso showroom
              </span>
              {SITE.address && <span className="mt-1 block text-sm text-white/80">{SITE.address}</span>}
            </figcaption>
          </figure>
        </Reveal>

        {/* Formulário */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="glass overflow-hidden rounded-3xl p-5 sm:p-8">
            {sentUrl ? (
              <div className="py-10 text-center" role="status">
                <CircleCheck className="mx-auto size-12 text-red-bright" strokeWidth={1.5} aria-hidden="true" />
                <h2 className="mt-6 font-heading text-2xl font-semibold tracking-tight">Mensagem pronta</h2>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-gray">
                  Abrimos o WhatsApp com a sua mensagem preenchida. É só enviar para falar com um consultor.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href={sentUrl} iconLeft={WhatsAppIcon} icon={null}>
                    Abrir WhatsApp novamente
                  </Button>
                  <Button variant="secondary" onClick={() => setSentUrl(null)}>
                    Nova mensagem
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-semibold tracking-tight">Envie sua mensagem</h2>
                  <p className="mt-1 text-sm text-gray">Montamos a mensagem e abrimos o WhatsApp para você enviar.</p>
                </div>

                <Field id="nome" label="Nome" error={errors.name?.message}>
                  <input
                    id="nome"
                    autoComplete="name"
                    placeholder="Seu nome"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy('name')}
                    className={cn(inputClass, errors.name ? 'border-red-bright' : 'border-line-strong')}
                    {...register('name', {
                      required: 'Informe seu nome.',
                      minLength: { value: 2, message: 'Nome muito curto.' },
                    })}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="phone" label="WhatsApp / Telefone" error={errors.phone?.message}>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="(11) 98765-4321"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={describedBy('phone')}
                      className={cn(inputClass, errors.phone ? 'border-red-bright' : 'border-line-strong')}
                      {...phoneField}
                      onChange={(e) => {
                        e.target.value = formatPhone(e.target.value);
                        phoneField.onChange(e);
                      }}
                    />
                  </Field>
                  <Field id="email" label="E-mail" optional error={errors.email?.message}>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={describedBy('email')}
                      className={cn(inputClass, errors.email ? 'border-red-bright' : 'border-line-strong')}
                      {...register('email', {
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido.' },
                      })}
                    />
                  </Field>
                </div>

                <SelectField
                  id="vehicle"
                  label="Veículo de interesse"
                  selectClassName="h-12 text-[15px]"
                  disabled={isLoading}
                  {...register('vehicle')}
                >
                  <option value="">Ainda não sei / outro veículo</option>
                  {sortVehicles(vehicles, 'destaques').map((v) => (
                    <option key={v.id} value={getVehicleSlug(v)}>
                      {getVehicleFullName(v)} {v.year} — {formatPrice(v.price)}
                    </option>
                  ))}
                </SelectField>

                <Field id="mensagem" label="Mensagem" optional>
                  <textarea
                    id="mensagem"
                    rows={4}
                    placeholder="Conte o que você procura, se tem carro na troca, melhor horário…"
                    className={cn(inputClass, 'h-auto min-h-28 resize-y border-line-strong py-3')}
                    {...register('message', { maxLength: 800 })}
                  />
                </Field>

                <Button type="submit" size="lg" fullWidth disabled={isSubmitting} iconLeft={Send} icon={null}>
                  Enviar pelo WhatsApp
                </Button>
                <p className="text-center text-xs text-gray">
                  Seus dados são usados apenas para montar a mensagem — nada é armazenado no site.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
