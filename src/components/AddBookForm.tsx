import { useState, type FormEvent } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import type { ReadingStatus } from '@/types';
import { STATUS_META, STATUS_ORDER } from '@/types';

const MAX_TITLE_LENGTH = 60;

interface AddBookFormProps {
  onAdd: (title: string, status: ReadingStatus) => void;
  existingTitles: Set<string>;
}

function normalize(title: string): string {
  return title.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function AddBookForm({ onAdd, existingTitles }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<ReadingStatus>('want');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    if (trimmed.length > MAX_TITLE_LENGTH) {
      setError('Book title must be 60 characters or fewer.');
      return;
    }

    if (existingTitles.has(normalize(trimmed))) {
      setError('This book is already in your reading list.');
      return;
    }

    onAdd(trimmed, status);
    setTitle('');
    setStatus('want');
    setOpen(false);
    setError(null);
  }

  function handleClose() {
    setOpen(false);
    setTitle('');
    setStatus('want');
    setError(null);
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      {open ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Book title"
            autoFocus
            maxLength={MAX_TITLE_LENGTH}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:ring-2 ${
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10'
            }`}
          />

          {error && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>{title.length}/{MAX_TITLE_LENGTH}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_ORDER.map((s) => {
              const m = STATUS_META[s];
              const active = s === status;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-all ${
                    active
                      ? `${m.badge} ring-2`
                      : 'bg-white text-stone-500 ring-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 active:bg-stone-950"
            >
              Add Book
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
        >
          <Plus className="h-4 w-4" />
          Add a book
        </button>
      )}
    </div>
  );
}
