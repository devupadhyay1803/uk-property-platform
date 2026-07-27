'use server';

import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database';

export interface LoginState {
  ok: boolean;
  error?: string;
  redirectTo?: string;
}

const ROLE_REDIRECTS: Record<UserRole, string> = {
  admin: '/admin/overview',
  landlord: '/dashboard',
  tenant: '/portal',
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectParam = String(formData.get('redirect') ?? '').trim() || null;

  if (!email || !password) {
    return { ok: false, error: 'Please enter your email and password.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  // Try app_metadata first (set by Auth Hook), then fall back to profiles table
  let role: UserRole = (data.user.app_metadata?.role as UserRole) ?? 'tenant';

  if (!data.user.app_metadata?.role) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    if (profile?.role) {
      role = profile.role as UserRole;
    }
  }

  const redirectTo = redirectParam ?? ROLE_REDIRECTS[role] ?? '/';

  return { ok: true, redirectTo };
}

