'use client';

import { useActionState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/logo';
import { loginAction, type LoginState } from './actions';

const initial: LoginState = { ok: false };

const field =
 'w-full border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-colors';

function LoginForm() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const redirectTo = searchParams.get('redirect') ?? '';
 const [state, formAction, pending] = useActionState(loginAction, initial);

 useEffect(() => {
 if (state.ok && state.redirectTo) {
 router.push(state.redirectTo);
 router.refresh();
 }
 }, [state, router]);

 return (
 <div className="w-full min-h-screen flex flex-col md:flex-row relative z-10 bg-white">
 
 {/* Left Column: Image */}
 <div className="relative hidden md:flex w-full md:w-1/2 bg-slate-900 flex-col justify-end p-12 lg:p-20 overflow-hidden">
 <Image
 src="/images/login-hero-bright.jpg"
 alt="Luxury UK Property"
 fill
 className="object-cover opacity-90 hover:scale-105 transition-transform duration-[10s]"
 priority
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
 
 <div className="relative z-10">
 <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4">
 Find Your Perfect<br/>Property Today
 </h2>
 <p className="text-slate-100 text-sm font-medium leading-relaxed max-w-md">
 Join the UK's premier platform and start exploring the best real estate opportunities tailored to your luxury lifestyle.
 </p>
 </div>
 </div>

 {/* Right Column: Form */}
 <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative">
 {/* Back Link */}
 <Link href="/" className="absolute top-8 right-8 text-[13px] font-semibold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
 ← Back to site
 </Link>

 <div className="mb-10 flex flex-col items-start">
 <Logo className="mb-6 scale-110 origin-left" />
 <h1 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">Sign In</h1>
 <p className="mt-3 text-sm text-slate-500 font-light leading-relaxed">
 Welcome back! Please enter your details to access your portal.
 </p>
 </div>

 <form action={formAction} className="space-y-6">
 <input type="hidden" name="redirect" value={redirectTo} />
 
 <div>
 <label htmlFor="login-email" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
 Your email
 </label>
 <input id="login-email" name="email" type="email" autoComplete="email" placeholder="jane.doe@example.com" className={field} required />
 </div>
 
 <div>
 <label htmlFor="login-password" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
 Password
 </label>
 <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" className={field} required />
 </div>

 {state.error && (
 <p className=" bg-red-50 p-3 text-sm text-red-700" role="alert">
 {state.error}
 </p>
 )}

 <button
 type="submit"
 disabled={pending}
 className="w-full bg-[#1c1c1c] px-4 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60 shadow-lg shadow-slate-900/10"
 >
 {pending ? 'Signing in…' : 'Sign In'}
 </button>
 </form>

 <p className="mt-6 text-center text-sm text-slate-500">
 Don't have an account? <Link href="/login" className="font-bold text-slate-900 hover:underline">Sign up</Link>
 </p>

 <div className="mt-8 flex items-center justify-center gap-4">
 <div className="h-px bg-slate-100 flex-1" />
 <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">Or</span>
 <div className="h-px bg-slate-100 flex-1" />
 </div>

 <div className="mt-6 grid grid-cols-2 gap-4">
 <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
 Google
 </button>
 <button className="flex items-center justify-center gap-2 border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
 Apple
 </button>
 </div>

 </div>
 </div>
 );
}

export default function LoginPage() {
 return (
 <Suspense>
 <LoginForm />
 </Suspense>
 );
}
