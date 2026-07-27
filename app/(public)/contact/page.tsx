import type { Metadata } from 'next';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { 
  title: 'Contact us | UK Property Platform', 
  description: 'Get in touch with our dedicated property support team.' 
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      {/* 1. Hero Section with Centered Form */}
      <section className="relative flex min-h-[650px] lg:min-h-[750px] w-full flex-col justify-center items-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=3540&auto=format&fit=crop"
            alt="Luxury UK Property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-2xl px-4 animate-fade-in">
          <div className="bg-white p-8 md:p-10 shadow-2xl text-center rounded-sm">
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-2">Get in touch</h1>
            <p className="text-slate-500 mb-6 font-light">Send us a message and our team will respond within 24 hours.</p>
            
            <form className="space-y-5 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Full Name</label>
                  <input type="text" id="name" className="w-full border-b border-slate-300 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-colors" placeholder="Jane Doe" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Email Address</label>
                  <input type="email" id="email" className="w-full border-b border-slate-300 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-colors" placeholder="jane@example.com" required />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Phone Number <span className="text-slate-400 lowercase font-normal">(optional)</span></label>
                <input type="tel" id="phone" className="w-full border-b border-slate-300 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-colors" placeholder="+44 (0) 7700 900000" />
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">Message</label>
                <textarea id="message" rows={3} className="w-full border-b border-slate-300 bg-transparent py-1.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-colors resize-none" placeholder="How can we help you?" required />
              </div>

              <button type="button" className="w-full bg-[#e60000] text-white font-semibold uppercase tracking-widest text-sm py-3.5 mt-2 hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                Send Message <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Contact Details Banner (Slimmed Down) */}
      <section className="bg-white py-10 border-b border-slate-200">
        <div className="mx-auto max-w-[1400px] px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="flex flex-col items-center py-2">
            <div className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-full mb-3 text-[#e60000]">
              <Mail className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg text-slate-900 mb-1">Email</h3>
            <p className="text-slate-500 font-light text-sm">info@ukpropertyplatform.co.uk</p>
          </div>
          
          <div className="flex flex-col items-center py-2">
            <div className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-full mb-3 text-[#e60000]">
              <Phone className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg text-slate-900 mb-1">Phone</h3>
            <p className="text-slate-500 font-light text-sm">+44 (0) 123 456 7890</p>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-full mb-3 text-[#e60000]">
              <MapPin className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg text-slate-900 mb-1">Head Office</h3>
            <p className="text-slate-500 font-light text-sm">123 Berkeley Square, London</p>
          </div>
        </div>
      </section>
    </div>
  );
}
