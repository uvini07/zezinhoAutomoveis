import { useEffect, useState } from 'react';
import { fetchVehicles, getCachedVehicles } from '@/services/vehicles';

/** Estoque + estado de carregamento. Usa cache após a primeira carga. */
export function useVehicles() {
  const [vehicles, setVehicles] = useState(getCachedVehicles);

  useEffect(() => {
    if (vehicles) return;
    let active = true;
    fetchVehicles().then((list) => active && setVehicles(list));
    return () => {
      active = false;
    };
  }, [vehicles]);

  return { vehicles: vehicles ?? [], isLoading: !vehicles };
}
