import { storagePublicUrl } from "@/lib/format";

/**
 * Renders a listing photo, or a neutral placeholder when none exists
 * (the dummy seed listings have no photos yet).
 *
 * Uses a plain <img> deliberately: the Supabase Storage host is env-driven and
 * not known at build time. Swap for next/image + images.remotePatterns once the
 * production storage host is fixed (perf optimization, ARCHITECTURE §8/§11).
 */
export function PropertyImage({
  path,
  alt,
  className = "",
}: {
  path?: string | null;
  alt: string;
  className?: string;
}) {
  if (!path) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-700 ${className}`}
        aria-label="No photo available"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 9.5 12 3l9 6.5V21H3V9.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  const src = path.startsWith("http")
    ? path
    : storagePublicUrl("property-photos", path);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
