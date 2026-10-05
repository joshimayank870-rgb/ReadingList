import { Bookmark, BookOpen, BookCheck, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Book, ReadingStatus } from '@/types';
import { STATUS_META, STATUS_ORDER } from '@/types';

const STATUS_ICONS = {
  Bookmark,
  BookOpen,
  BookCheck,
} as const;

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: ReadingStatus) => void;
  onRemove: (id: string) => void;
}

export function BookCard({ book, onStatusChange, onRemove }: BookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[book.status];
  const StatusIcon = STATUS_ICONS[meta.icon];

  useEffect(() => {
    if (!menuOpen) return;
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  return (
    <div className="group relative flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-stone-300">
      <div className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${meta.dot}`} />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold leading-snug text-stone-800">
          {book.title}
        </h3>
        <span
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.badge}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onRemove(book.id)}
        className="shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label="Delete book"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          aria-label="Book actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 z-10 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
              Move to
            </p>
            {STATUS_ORDER.map((s) => {
              const m = STATUS_META[s];
              const Icon = STATUS_ICONS[m.icon];
              const active = s === book.status;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={active}
                  onClick={() => {
                    onStatusChange(book.id, s);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? 'font-medium text-stone-300'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
            <div className="my-1 border-t border-stone-100" />
            <button
              type="button"
              onClick={() => {
                onRemove(book.id);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
