import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '403 — Forbidden' };

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <h1 className="text-6xl font-bold text-slate-300 dark:text-slate-700">403</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">You don't have permission to access this page.</p>
      <Link href="/" className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
        Go home
      </Link>
    </div>
  );
}
