"use server";

import { createClient } from "@/lib/supabase/server";

export interface EnquiryState {
  ok: boolean;
  error?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * Submit an enquiry against a listing (F1/F10). Runs under RLS as anon — the
 * "anyone submits enquiry" policy allows the insert; the DB trigger sets
 * landlord_id from the property so routing can't be tampered with client-side.
 * Treat all input as untrusted (Server Action security boundary).
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const propertyId = String(formData.get("property_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();

  if (!propertyId) return { ok: false, error: "Missing property reference." };
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!isEmail(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (message.length < 5)
    return { ok: false, error: "Please enter a short message." };

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    property_id: propertyId,
    name,
    email,
    phone,
    message,
  });

  if (error) {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
  return { ok: true };
}
