import { createClient } from '@/lib/supabase/server';
import type { UserRole, Profile } from '@/types/database';
import { redirect } from 'next/navigation';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  profile: Profile;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) return null;

  // Use the DB profile role as the source of truth; app_metadata is a cache
  const role = (profile.role as UserRole) ?? (user.app_metadata?.role as UserRole) ?? 'tenant';

  return { id: user.id, email: user.email ?? '', role, profile };
}

export async function requireRole(...roles: UserRole[]): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!roles.includes(user.role)) redirect('/403');
  return user;
}
