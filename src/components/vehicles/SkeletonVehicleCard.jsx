import SkeletonVehicleImage from '@/components/vehicles/SkeletonVehicleImage';

const bar = 'skeleton-surface rounded-xs';

/** Estado de loading do card — mesma estrutura do VehicleCard. */
export default function SkeletonVehicleCard() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-md border border-line bg-graphite">
      <div className="relative aspect-[16/10]">
        <SkeletonVehicleImage compact />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className={`${bar} h-3 w-16`} />
        <div className={`${bar} mt-2.5 h-5 w-3/4`} />
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${bar} h-3.5 w-4/5`} />
          ))}
        </div>
        <div className={`${bar} mt-6 h-3 w-12`} />
        <div className={`${bar} mt-2 h-7 w-40`} />
        <div className="mt-4 grid gap-1">
          <div className={`${bar} h-11`} />
          <div className={`${bar} mx-auto my-3.5 h-4 w-32`} />
        </div>
      </div>
    </div>
  );
}
