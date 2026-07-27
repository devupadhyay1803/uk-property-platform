'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Only apply transparent overlay logic on pages with dark hero banners
  const isHeroPage = pathname === '/' || pathname === '/about' || pathname === '/properties' || pathname === '/contact' || pathname.startsWith('/properties/');
  const isSolid = !isHeroPage || isScrolled || isHovered;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-transparent border-b border-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
        
        {/* Left Section: Logo */}
        <div className="flex items-center gap-8">
          <Logo lightText={!isSolid} className="transition-colors duration-300" />
        </div>

        {/* Right Section: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link 
            href="/properties" 
            className={`text-[15px] font-semibold transition-colors ${isSolid ? 'text-slate-900 hover:text-red-600' : 'text-white hover:text-white/80'}`}
          >
            Find a property
          </Link>
          <Link 
            href="/about" 
            className={`text-[15px] font-semibold transition-colors ${isSolid ? 'text-slate-900 hover:text-red-600' : 'text-white hover:text-white/80'}`}
          >
            About us
          </Link>
          <Link 
            href="/contact" 
            className={`text-[15px] font-semibold transition-colors ${isSolid ? 'text-slate-900 hover:text-red-600' : 'text-white hover:text-white/80'}`}
          >
            Contact
          </Link>
          <Link 
            href="/login" 
            className={`ml-4 rounded-sm border px-6 py-2 text-sm font-semibold transition-colors ${
              isSolid 
                ? 'border-slate-300 text-slate-900 hover:bg-slate-50' 
                : 'border-white/40 text-white hover:bg-white/10'
            }`}
          >
            Sign in
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link 
            href="/login" 
            className={`text-sm font-semibold transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}
          >
            Sign in
          </Link>
          <details className="relative group">
            <summary className={`cursor-pointer p-1 list-none transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-label="Menu">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full mt-4 w-56 border border-slate-200 bg-white p-4 shadow-2xl">
              <Link href="/properties" className="block py-2 text-sm font-semibold text-slate-900 hover:text-red-600">Find a property</Link>
              <Link href="/about" className="block py-2 text-sm font-semibold text-slate-900 hover:text-red-600">About us</Link>
              <Link href="/contact" className="block py-2 text-sm font-semibold text-slate-900 hover:text-red-600">Contact</Link>
            </div>
          </details>
        </div>

      </div>
    </header>
  );
}
