import { ArrowDownUp } from 'lucide-react';
import SelectField from '@/components/ui/SelectField';
import { SORT_OPTIONS } from '@/utils/vehicleUtils';

export default function SortSelect({ value, onChange, hideLabel = false, className }) {
  return (
    <SelectField
      label="Ordenar por"
      hideLabel={hideLabel}
      icon={ArrowDownUp}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      selectClassName="text-[13px] sm:text-sm"
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </SelectField>
  );
}
