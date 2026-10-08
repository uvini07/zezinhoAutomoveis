import { vehicles as mockVehicles } from '@/data/vehicles';
import { MOCK_LATENCY_MS } from '@/config/site';

/*
 * Camada de dados. Hoje lê o arquivo MOCK; amanhã pode chamar uma API,
 * planilha ou CMS sem mudar nenhum componente:
 *
 *   const res = await fetch('/api/veiculos');
 *   return res.json();
 */

let cache = null;
let pending = null;

export const getCachedVehicles = () => cache;

export function fetchVehicles() {
  if (cache) return Promise.resolve(cache);
  pending ??= new Promise((resolve) => {
    setTimeout(() => {
      cache = mockVehicles;
      resolve(cache);
    }, MOCK_LATENCY_MS);
  });
  return pending;
}
