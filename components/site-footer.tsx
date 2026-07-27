import Link from "next/link";
import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 py-16 sm:py-24 text-slate-400">
      <div className="mx-auto w-full max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          <div className="md:col-span-1">
            <div className="mb-6">
              <Logo lightText={true} />
            </div>
            <p className="text-sm font-light text-slate-400 mb-6 max-w-xs">
              The premier platform for finding, letting, and managing luxury homes across the United Kingdom.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Services</h3>
            <ul className="space-y-4 text-[13px] font-medium">
              <li><Link href="/properties" className="hover:text-white transition-colors">Find a Property</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Company</h3>
            <ul className="space-y-4 text-[13px] font-medium">
              <li><Link href="/login" className="hover:text-white transition-colors">Agent Portal</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Landlord Login</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-6">Stay Updated</h3>
            <p className="text-[13px] font-medium mb-4">Subscribe to our newsletter for exclusive off-market opportunities.</p>
            <form className="flex" action="#">
              <input type="email" placeholder="Email address" className="w-full bg-slate-800 border-none px-4 py-3 text-sm text-white focus:ring-1 focus:ring-white outline-none" />
              <button type="button" className="bg-white px-4 text-sm font-semibold uppercase tracking-widest text-slate-900 hover:bg-slate-200 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 sm:mt-24 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} UK Property Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
