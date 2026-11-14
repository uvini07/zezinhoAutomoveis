import { Calendar, Cog, Fuel, Gauge } from 'lucide-react';
import { formatNumber, getYearLabel } from '@/utils/vehicleUtils';

/** Bloco de informações principais: ANO · KM · CÂMBIO · COMBUSTÍVEL. */
export default function VehicleQuickSpecs({ vehicle }) {
  const items = [
    { icon: Calendar, label: 'Ano', value: getYearLabel(vehicle) },
    { icon: Gauge, label: 'Km', value: vehicle.mileage == null ? '—' : formatNumber(vehicle.mileage) },
    { icon: Cog, label: 'Câmbio', value: vehicle.transmission },
    { icon: Fuel, label: 'Combustível', value: vehicle.fuel },
  ];

  return (
    <dl className="grid grid-cols-2 gap-2">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="glass flex flex-col gap-2 rounded-2xl p-4">
          <dt className="label-tech flex items-center gap-2">
            <Icon className="size-3.5 text-red-bright" aria-hidden="true" />
            {label}
          </dt>
          <dd className="font-heading text-lg font-semibold leading-none tnum text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
