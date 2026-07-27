import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = { 
  title: 'About us | UK Property', 
  description: 'Learn about UK Property Platform' 
};

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900 pb-24">
      {/* 1. Hero Section (Matched to KF: Centered text over image) */}
      <section className="relative h-[600px] lg:h-[700px] w-full animate-fade-in flex flex-col justify-center">
        <Image 
          src="/images/about-hero.jpg" 
          alt="Luxury UK Property" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold tracking-widest text-white uppercase mb-4">UK Property Platform</p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight">
            About us
          </h1>
        </div>
      </section>

      {/* 2. Introduction Statement (Matched to KF: Large serif intro) */}
      <section className="bg-white py-24 animate-scroll-reveal">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif leading-tight text-slate-900 mb-8">
            We work responsibly, in partnership, to enhance people's lives and environments.
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed font-semibold mb-6">
            Founded with a vision to redefine the UK lettings market, our platform is one of the nation's leading independent property networks. We play an integral part in bringing verified landlords and discerning tenants together to provide a seamless, secure, and transparent rental experience.
          </p>
          <p className="text-lg text-slate-500 leading-relaxed">
            Through our deep understanding of the property sector — both emerging urban markets and established rural estates — we're dedicated to meeting your property goals. Our culture of high performance and genuine passion allows us to strike the right balance — and that makes all the difference.
          </p>
        </div>
      </section>

      {/* 3. Stats / Reach Block (Matched to KF) */}
      <section className="bg-white pb-24 border-b border-slate-100 animate-scroll-reveal">
        <div className="mx-auto max-w-[1400px] px-6">
          <h2 className="text-3xl font-serif text-center mb-16">Our national reach</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-6xl md:text-7xl font-serif text-slate-900 mb-2">10+</div>
              <div className="text-xl font-bold mb-4">years of innovation</div>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                We've been active in the prop-tech industry for over a decade, giving us unique insight into market trends and the needs of modern renters and landlords.
              </p>
            </div>
            
            <div>
              <div className="text-6xl md:text-7xl font-serif text-slate-900 mb-2">40k+</div>
              <div className="text-xl font-bold mb-4">verified listings</div>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Our wide network of landlords means you'll always be able to find the perfect home, and we'll ensure every listing meets our strict quality standards.
              </p>
            </div>
            
            <div>
              <div className="text-6xl md:text-7xl font-serif text-slate-900 mb-2">100k+</div>
              <div className="text-xl font-bold mb-4">happy tenants</div>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Our power is in our people. Our support teams work tirelessly to create a connected, tailored service experience for every single transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Split Blocks (Matched to KF: alternating, landscape images, red buttons) */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1400px] px-6 text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-slate-900">How we can help you</h2>
        </div>

        {/* Block 1 */}
        <div className="mx-auto max-w-[1400px] px-6 mb-24 md:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-scroll-reveal">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image 
              src="/images/about-tenant.jpg" 
              alt="Finding your perfect home" 
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:pl-8 lg:pr-16">
            <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">We'll find your next home.</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We specialise in a wide range of residential property services. From finding your family home to managing your tenancy details, we'll meet you wherever you are on your property journey.
            </p>
            <Link href="/properties" className="inline-block border border-[#e60000] text-[#e60000] font-semibold px-8 py-3 hover:bg-[#e60000] hover:text-white transition-colors">
              Our residential services
            </Link>
          </div>
        </div>

        {/* Block 2 */}
        <div className="mx-auto max-w-[1400px] px-6 mb-24 md:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-scroll-reveal">
          <div className="order-2 lg:order-1 lg:pl-16 lg:pr-8">
            <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">We'll support your investment growth.</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Our dedicated landlord portal covers the breadth of property management, from applicant tracking and building maintenance to automated rent collection and performance strategy.
            </p>
            <Link href="/login" className="inline-block border border-[#e60000] text-[#e60000] font-semibold px-8 py-3 hover:bg-[#e60000] hover:text-white transition-colors">
              Our landlord services
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[16/9] w-full overflow-hidden">
            <Image 
              src="/images/about-landlord.jpg" 
              alt="Seamless property management" 
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Block 3: Location / Offices */}
        <div className="mx-auto max-w-[1400px] px-6 mb-24 md:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-scroll-reveal">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop" 
              alt="Central London skyline" 
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:pl-8 lg:pr-16">
            <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">We're where you need us.</h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We operate across the UK — from Central London to the Home Counties and beyond — providing a service that's locally expert and globally informed.
            </p>
            <Link href="/contact" className="inline-block border border-[#e60000] text-[#e60000] font-semibold px-8 py-3 hover:bg-[#e60000] hover:text-white transition-colors">
              Find an office near you
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
