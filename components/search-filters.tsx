import Link from "next/link";
import type { ListingFilters } from "@/lib/queries/properties";

const TYPES = ["flat", "house", "studio", "bungalow", "maisonette"];

const inputCls =
  "w-full border-b border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white dark:focus:border-white";
const labelCls =
  "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400";

/**
 * GET form → navigates to /properties with query params. No client JS required
 * (progressive enhancement); the results page reads searchParams server-side.
 */
export function SearchFilters({ current }: { current: ListingFilters }) {
  return (
    <form
      action="/properties"
      method="get"
      className="grid grid-cols-1 gap-4 bg-white p-6 shadow-xl sm:grid-cols-2 lg:grid-cols-6 dark:border-slate-800 dark:bg-[#111111]"
    >
      <div className="lg:col-span-2">
        <label className={labelCls} htmlFor="q">
          Keyword
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={current.q ?? ""}
          placeholder="e.g. garden, studio"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={current.location ?? ""}
          placeholder="City"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor="type">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={current.type ?? ""}
          className={inputCls}
        >
          <option value="">Any</option>
          {TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="minPrice">
          Min £ pcm
        </label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          min="0"
          step="50"
          defaultValue={current.minPrice ?? ""}
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls} htmlFor="maxPrice">
          Max £ pcm
        </label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min="0"
          step="50"
          defaultValue={current.maxPrice ?? ""}
          className={inputCls}
        />
      </div>
      <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700 lg:col-span-3 dark:text-slate-300">
        <input
          type="checkbox"
          name="availableOnly"
          value="1"
          defaultChecked={current.availableOnly}
          className="h-4 w-4 border-slate-300 rounded-none accent-slate-900"
        />
        Available only
      </label>
      <div className="flex items-end gap-2 lg:col-span-3">
        <button
          type="submit"
          className="w-full bg-slate-900 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Search
        </button>
        <Link
          href="/properties"
          className="border border-slate-300 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
