'use client';

import { useActionState } from 'react';
import { createListing, updateListing } from './actions';
import type { Property } from '@/types/database';

const TYPES = ['flat', 'house', 'studio', 'bungalow', 'maisonette'];
const field = 'w-full border-b border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none';
const labelCls = 'mb-2 block text-[10px] font-bold text-slate-500';

type Landlord = { id: string; full_name: string; email: string };

export function ListingForm({ listing, landlords }: { listing?: Property; landlords: Landlord[] }) {
 const action = listing ? updateListing : createListing;
 const [state, formAction, pending] = useActionState(action, { ok: false, error: '' });
 const pricePounds = listing ? listing.price_pcm / 100 : '';

 return (
 <form action={formAction} className="space-y-6 border border-slate-200 bg-white p-5">
 {listing && <input type="hidden" name="id" value={listing.id} />}
 {listing && <input type="hidden" name="slug" value={listing.slug} />}
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
 <div className="sm:col-span-2">
 <label htmlFor="listing-title" className={labelCls}>Title *</label>
 <input id="listing-title" name="title" defaultValue={listing?.title ?? ''} className={field} required />
 </div>
 <div>
 <label htmlFor="listing-landlord" className={labelCls}>Landlord *</label>
 <select id="listing-landlord" name="landlord_id" defaultValue={listing?.landlord_id ?? ''} className={field} required>
 <option value="">Select landlord</option>
 {landlords.map(l => <option key={l.id} value={l.id}>{l.full_name} ({l.email})</option>)}
 </select>
 </div>
 <div>
 <label htmlFor="listing-type" className={labelCls}>Type *</label>
 <select id="listing-type" name="property_type" defaultValue={listing?.property_type ?? 'flat'} className={field}>
 {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
 </select>
 </div>
 <div>
 <label htmlFor="listing-price" className={labelCls}>Price (£ pcm) *</label>
 <input id="listing-price" name="price_pcm" type="number" min="0" step="1" defaultValue={pricePounds} className={field} required />
 </div>
 <div>
 <label htmlFor="listing-status" className={labelCls}>Status</label>
 <select id="listing-status" name="status" defaultValue={listing?.status ?? 'available'} className={field}>
 <option value="available">Available</option>
 <option value="let">Let</option>
 </select>
 </div>
 <div>
 <label htmlFor="listing-beds" className={labelCls}>Bedrooms</label>
 <input id="listing-beds" name="bedrooms" type="number" min="0" defaultValue={listing?.bedrooms ?? ''} className={field} />
 </div>
 <div>
 <label htmlFor="listing-baths" className={labelCls}>Bathrooms</label>
 <input id="listing-baths" name="bathrooms" type="number" min="0" defaultValue={listing?.bathrooms ?? ''} className={field} />
 </div>
 <div className="sm:col-span-2">
 <label htmlFor="listing-address" className={labelCls}>Address line *</label>
 <input id="listing-address" name="address_line" defaultValue={listing?.address_line ?? ''} className={field} required />
 </div>
 <div>
 <label htmlFor="listing-city" className={labelCls}>City *</label>
 <input id="listing-city" name="city" defaultValue={listing?.city ?? ''} className={field} required />
 </div>
 <div>
 <label htmlFor="listing-postcode" className={labelCls}>Postcode *</label>
 <input id="listing-postcode" name="postcode" defaultValue={listing?.postcode ?? ''} className={field} required />
 </div>
 <div className="sm:col-span-2">
 <label htmlFor="listing-desc" className={labelCls}>Description</label>
 <textarea id="listing-desc" name="description" rows={4} defaultValue={listing?.description ?? ''} className={field} />
 </div>
 <div>
 <label htmlFor="listing-meta-title" className={labelCls}>Meta title (SEO)</label>
 <input id="listing-meta-title" name="meta_title" defaultValue={listing?.meta_title ?? ''} className={field} />
 </div>
 <div>
 <label htmlFor="listing-meta-desc" className={labelCls}>Meta description (SEO)</label>
 <input id="listing-meta-desc" name="meta_description" defaultValue={listing?.meta_description ?? ''} className={field} />
 </div>
 </div>
 <label className="flex items-center gap-2 text-sm text-slate-700">
 <input type="checkbox" name="published" value="1" defaultChecked={listing?.published ?? false} className="h-4 w-4 border-slate-300 accent-slate-900" />
 Publish immediately
 </label>
 {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
 <button type="submit" disabled={pending} className="w-full bg-slate-900 px-5 py-3 text-[11px] font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition">
 {pending ? 'Saving…' : (listing ? 'Update listing' : 'Create listing')}
 </button>
 </form>
 );
}
