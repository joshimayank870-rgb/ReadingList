import { Library, BookOpen, BookCheck } from 'lucide-react';

interface SummaryProps {
  total: number;
  reading: number;
  finished: number;
}

export function Summary({ total, reading, finished }: SummaryProps) {
  const stats = [
    {
      label: 'Total Books',
      value: total,
      icon: Library,
      accent: 'text-stone-700',
      bg: 'bg-stone-100',
    },
    {
      label: 'Currently Reading',
      value: reading,
      icon: BookOpen,
      accent: 'text-sky-700',
      bg: 'bg-sky-50',
    },
    {
      label: 'Finished',
      value: finished,
      icon: BookCheck,
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-3"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
            >
              <Icon className={`h-4.5 w-4.5 ${s.accent}`} />
            </div>
            <div className="text-center sm:text-left">
              <p className={`text-xl font-bold leading-none ${s.accent} sm:text-2xl`}>
                {s.value}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-tight text-stone-500 sm:text-xs">
                {s.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
