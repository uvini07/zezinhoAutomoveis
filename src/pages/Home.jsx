import Hero from '@/components/home/Hero';
import StatsStrip from '@/components/home/StatsStrip';
import FeaturedCarousel from '@/components/home/FeaturedCarousel';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import WhySection from '@/components/home/WhySection';
import CTA from '@/components/home/CTA';
import PageTransition from '@/components/ui/PageTransition';
import JsonLd from '@/components/ui/JsonLd';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { SITE } from '@/config/site';

const dealerSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  image: `${SITE.url}/img/og-image.jpg`,
  logo: `${SITE.url}/img/logo-zezinho.png`,
};

export default function Home() {
  useDocumentMeta({ path: '/' });

  return (
    <PageTransition>
      <Hero />
      <StatsStrip />
      <FeaturedCarousel />
      <CategoryShowcase />
      <WhySection />
      <CTA />
      <JsonLd data={dealerSchema} />
    </PageTransition>
  );
}
