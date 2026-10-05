import { useState, useEffect, useMemo, useCallback } from 'react';
import { BookMarked } from 'lucide-react';
import type { Book, ReadingStatus } from '@/types';
import { STATUS_ORDER } from '@/types';
import { loadBooks, saveBooks } from '@/lib/storage';
import { AddBookForm } from '@/components/AddBookForm';
import { BookCard } from '@/components/BookCard';
import { FilterTabs, type FilterValue } from '@/components/FilterTabs';
import { Summary } from '@/components/Summary';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBooks(loadBooks());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveBooks(books);
  }, [books, loaded]);

  const handleAdd = useCallback((title: string, status: ReadingStatus) => {
    const book: Book = {
      id: crypto.randomUUID(),
      title,
      status,
      addedAt: Date.now(),
    };
    setBooks((prev) => [book, ...prev]);
  }, []);

  const handleStatusChange = useCallback((id: string, status: ReadingStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const existingTitles = useMemo(() => {
    return new Set(
      books.map((b) =>
        b.title.trim().replace(/\s+/g, ' ').toLowerCase()
      )
    );
  }, [books]);

  const counts = useMemo(() => {
    const base: Record<FilterValue, number> = {
      all: books.length,
      want: 0,
      reading: 0,
      finished: 0,
    };
    for (const b of books) base[b.status]++;
    return base;
  }, [books]);

  const visibleBooks = useMemo(() => {
    const filtered = filter === 'all' ? books : books.filter((b) => b.status === filter);
    return [...filtered].sort((a, b) => {
      const orderA = STATUS_ORDER.indexOf(a.status);
      const orderB = STATUS_ORDER.indexOf(b.status);
      if (orderA !== orderB) return orderA - orderB;
      return b.addedAt - a.addedAt;
    });
  }, [books, filter]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Reading List</h1>
              <p className="text-xs text-stone-500">Track books across your studies</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        <AddBookForm onAdd={handleAdd} existingTitles={existingTitles} />

        {books.length > 0 && (
          <>
            <Summary
              total={counts.all}
              reading={counts.reading}
              finished={counts.finished}
            />
            <FilterTabs active={filter} counts={counts} onChange={setFilter} />
          </>
        )}

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/50 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
              <BookMarked className="h-7 w-7 text-stone-400" />
            </div>
            <p className="text-base font-medium text-stone-700">
              Your reading list is empty. Add your first book.
            </p>
          </div>
        ) : visibleBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
            <p className="text-sm text-stone-500">
              No books in this category yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-2xl px-4 pb-8 pt-2">
        <p className="text-center text-xs text-stone-400">
          Saved on this device only.
        </p>
      </footer>
    </div>
  );
}
