import Link from 'next/link';

export function Logo({ className = "", lightText = false }: { className?: string; lightText?: boolean }) {
  return (
    <Link href="/" className={`text-2xl font-serif font-bold tracking-tight flex items-center gap-2 ${lightText ? 'text-white' : 'text-slate-900'} ${className}`}>
      <div className="grid grid-cols-2 gap-0.5 w-6 h-6 bg-red-600 p-0.5 shrink-0">
         <div className="bg-white rounded-tl-[2px]"></div><div className="bg-white rounded-tr-[2px]"></div>
         <div className="bg-white rounded-bl-[2px]"></div><div className="bg-white rounded-br-[2px]"></div>
      </div>
      UK Property
    </Link>
  );
}
