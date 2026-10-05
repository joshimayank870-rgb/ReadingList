export type ReadingStatus = 'want' | 'reading' | 'finished';

export interface Book {
  id: string;
  title: string;
  status: ReadingStatus;
  addedAt: number;
}

export const STATUS_META: Record<
  ReadingStatus,
  { label: string; badge: string; dot: string; icon: 'Bookmark' | 'BookOpen' | 'BookCheck' }
> = {
  want: {
    label: 'Want to Read',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
    icon: 'Bookmark',
  },
  reading: {
    label: 'Reading',
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    dot: 'bg-sky-500',
    icon: 'BookOpen',
  },
  finished: {
    label: 'Finished',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
    icon: 'BookCheck',
  },
};

export const STATUS_ORDER: ReadingStatus[] = ['want', 'reading', 'finished'];
