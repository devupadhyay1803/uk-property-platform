import Link from 'next/link';
import { requireRole } from '@/lib/queries/auth';
import { SignOutButton } from '@/components/sign-out-button';
import { Logo } from '@/components/logo';
import { Home, Wrench, Menu } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Tenant Portal' };

const sidebarLinks = [
 { href: '/portal', label: 'My Tenancy', icon: Home },
 { href: '/portal/requests', label: 'Maintenance', icon: Wrench },
];

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
 const user = await requireRole('tenant', 'admin');
 
 return (
 <div className="flex min-h-screen bg-white font-sans">
 {/* Mobile Header */}
  <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
  <Logo />
  <details className="relative group">
  <summary className="cursor-pointer p-2 text-slate-600 hover:bg-slate-50 list-none [&::-webkit-details-marker]:hidden">
  <Menu className="h-6 w-6" />
  </summary>
  <div className="absolute right-0 top-full mt-2 w-56 border border-slate-200 bg-white p-2 shadow-xl z-50">
  {sidebarLinks.map((link) => {
  const Icon = link.icon;
  return (
  <Link
  key={link.href}
  href={link.href}
  className="flex items-center gap-3 rounded-none px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
  >
  <Icon className="h-5 w-5" />
  {link.label}
  </Link>
  );
  })}
  <div className="border-t border-slate-100 mt-2 pt-2 px-2">
  <SignOutButton />
  </div>
  </div>
  </details>
  </div>

 {/* Desktop Sidebar */}
 <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-slate-900 md:flex">
 <div className="flex h-20 items-center px-5 border-b border-slate-800">
 <Logo lightText />
 </div>
 
 <div className="p-4">
 <p className="px-4 text-[10px] font-bold text-slate-500 mb-4">
 Portal
 </p>
 <nav className="flex-1 space-y-1">
 {sidebarLinks.map((link) => {
 const Icon = link.icon;
 return (
 <Link
 key={link.href}
 href={link.href}
 className="flex items-center gap-3 rounded-none px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
 >
 <Icon className="h-5 w-5" />
 {link.label}
 </Link>
 );
 })}
 </nav>
 </div>

 <div className="mt-auto border-t border-slate-800 p-4">
 <div className="flex items-center gap-3 px-4 py-3">
 <div className="flex h-8 w-8 items-center justify-center bg-slate-800 text-sm font-bold text-slate-300">
 {user.profile.full_name?.charAt(0).toUpperCase() || 'T'}
 </div>
 <div className="flex-1 overflow-hidden">
 <p className="truncate text-sm font-medium text-white">{user.profile.full_name || 'Tenant'}</p>
 <p className="truncate text-xs text-slate-500">{user.email}</p>
 </div>
 </div>
 <div className="px-4 mt-2">
 <SignOutButton />
 </div>
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 min-w-0 md:pl-64">
 <div className="mx-auto max-w-5xl p-4 pt-24 md:p-4 md:pt-12">
 {children}
 </div>
 </main>
 </div>
 );
}
