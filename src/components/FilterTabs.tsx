import type { ReadingStatus } from '@/types';
import { STATUS_META, STATUS_ORDER } from '@/types';

export type FilterValue = 'all' | ReadingStatus;

interface FilterTabsProps {
  active: FilterValue;
  counts: Record<FilterValue, number>;
  onChange: (filter: FilterValue) => void;
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  ...STATUS_ORDER.map((s) => ({ value: s as FilterValue, label: STATUS_META[s].label })),
];

export function FilterTabs({ active, counts, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        const count = counts[f.value] ?? 0;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-50'
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 text-xs ${
                isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
