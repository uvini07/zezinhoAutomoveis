const bar = 'skeleton-surface rounded-full';

/** Estado de carregamento: mesma forma do cartão de vidro. */
export default function SkeletonVehicleCard() {
  return (
    <div aria-hidden="true" className="glass flex h-full flex-col overflow-hidden rounded-[1.75rem] p-2">
      <div className="skeleton-surface aspect-[4/3] rounded-[1.35rem]" />
      <div className="px-3 pb-3 pt-4">
        <div className={`${bar} h-3 w-14`} />
        <div className={`${bar} mt-2 h-5 w-3/4`} />
        <div className="mt-4 flex justify-between">
          <div className={`${bar} h-4 w-28`} />
          <div className={`${bar} h-5 w-24`} />
        </div>
      </div>
    </div>
  );
}
