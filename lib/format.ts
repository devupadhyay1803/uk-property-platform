/** Price is stored as pence-per-month (integer, GBP). Render as £X,XXX pcm. */
export function formatPricePcm(pence: number): string {
  const pounds = Math.round(pence / 100);
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(pounds);
}

/** Public URL for an object in a public Supabase Storage bucket. */
export function storagePublicUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
