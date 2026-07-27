"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "./actions";

const initial: EnquiryState = { ok: false };

const field =
  "w-full border border-slate-300 bg-transparent px-3 py-2.5 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:text-white";

export function EnquiryForm({ propertyId }: { propertyId: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);

  if (state.ok) {
    return (
      <div className="border border-emerald-300 bg-emerald-50 p-4 text-[13px] text-emerald-800">
        Thanks — your enquiry has been sent. The landlord or our team will be in
        touch.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="property_id" value={propertyId} />
      <div>
        <label className="sr-only" htmlFor="name">
          Your name
        </label>
        <input id="name" name="name" placeholder="Your name" className={field} required />
      </div>
      <div>
        <label className="sr-only" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          className={field}
          required
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="phone">
          Phone (optional)
        </label>
        <input id="phone" name="phone" placeholder="Phone (optional)" className={field} />
      </div>
      <div>
        <label className="sr-only" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="I'd like to arrange a viewing…"
          className={field}
          required
        />
      </div>

      {state.error && (
        <p className="text-[13px] text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-slate-900 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Register Interest"}
      </button>
      <p className="text-[11px] text-slate-400 mt-2 text-center">
        By enquiring you agree to our privacy policy.
      </p>
    </form>
  );
}
