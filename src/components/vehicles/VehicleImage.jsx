import { useState } from 'react';
import SkeletonVehicleImage from '@/components/vehicles/SkeletonVehicleImage';
import { cn } from '@/utils/cn';

/**
 * Imagem do veículo com lazy loading e fade-in.
 * src === null (ou erro ao carregar) → SkeletonVehicleImage.
 * Para trocar pelas fotos reais basta preencher `image` / `images` nos dados.
 * Preenche o pai: o container define a proporção.
 */
export default function VehicleImage({ src, alt, priority = false, sizes, placeholderLabel, className }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) return <SkeletonVehicleImage label={placeholderLabel} />;

  const loaded = loadedSrc === src;
  return (
    <>
      {!loaded && <SkeletonVehicleImage compact label={alt} />}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
      />
    </>
  );
}
