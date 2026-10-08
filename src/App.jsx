import { useEffect } from 'react';
import { Navigate, createBrowserRouter, useNavigate, useParams } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { MotionConfig } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Loader from '@/components/ui/Loader';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import { fetchVehicles } from '@/services/vehicles';
import { findVehicle, getVehicleUrl } from '@/utils/vehicleUtils';

/** Páginas secundárias carregadas sob demanda (code splitting). */
const lazyPage = (load) => () => load().then((m) => ({ Component: m.default }));

/** Compatibilidade: /veiculo/:id → /veiculos/:slug */
function LegacyVehicleRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchVehicles().then((list) => {
      const vehicle = findVehicle(list, id);
      navigate(vehicle ? getVehicleUrl(vehicle) : '/estoque', { replace: true });
    });
  }, [id, navigate]);
  return <Loader className="py-section" />;
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    HydrateFallback: () => <Loader className="min-h-dvh justify-center" />,
    children: [
      { index: true, Component: Home },
      { path: 'estoque', lazy: lazyPage(() => import('@/pages/Catalog')) },
      { path: 'veiculos', element: <Navigate to="/estoque" replace /> },
      { path: 'veiculos/:slug', lazy: lazyPage(() => import('@/pages/VehicleDetails')) },
      { path: 'veiculo/:id', Component: LegacyVehicleRedirect },
      { path: 'contato', lazy: lazyPage(() => import('@/pages/Contact')) },
      { path: '*', Component: NotFound },
    ],
  },
]);

/** reducedMotion="user" respeita prefers-reduced-motion em todo o site. */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}
