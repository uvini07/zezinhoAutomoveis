import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';

/**
 * Bottom sheet mobile com spring, arraste para fechar (pela alça),
 * foco preso e scroll interno isolado (overscroll-contain).
 */
export default function BottomSheet({ open, onClose, id, title, subtitle, footer, children }) {
  const ref = useDialog(open, onClose);
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={ref}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-titulo`}
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-lg border-t border-line-strong bg-black-2 shadow-deep outline-none"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 360, mass: 0.9 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <span aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-20 bg-red" />
            <div
              className="shrink-0 cursor-grab touch-none px-gutter pb-3 pt-2.5 active:cursor-grabbing"
              onPointerDown={(event) => dragControls.start(event)}
            >
              <span aria-hidden="true" className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/20" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 id={`${id}-titulo`} className="font-heading text-lg font-semibold uppercase tracking-wide">
                    {title}
                  </h2>
                  {subtitle && <p className="label-tech mt-0.5">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-11 place-items-center rounded-sm border border-line-strong text-white transition-colors hover:border-white/40"
                  aria-label="Fechar"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-line px-gutter">
              {children}
            </div>
            {footer && (
              <div className="shrink-0 border-t border-line bg-black px-gutter pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
