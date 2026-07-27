import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of service', description: 'UK Property Platform terms of service.' };

export default function TermsPage() {
 return (
 <div className="mx-auto max-w-3xl px-4 py-12">
 <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of service</h1>
 <div className="mt-6 space-y-4 text-slate-700 leading-relaxed dark:text-slate-300">
 <p className=" border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">This is a placeholder terms of service document. The final version will be provided by the client and should be reviewed by a legal professional.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Use of the platform</h2>
 <p>By accessing UK Property Platform, you agree to these terms. The platform is provided for browsing rental property listings in the United Kingdom.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Accounts</h2>
 <p>Landlord and tenant accounts are created by the platform administrator. You are responsible for maintaining the security of your account credentials.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Enquiries</h2>
 <p>Enquiries submitted through the platform are forwarded to the relevant landlord or administrator. We do not guarantee response times from property owners.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Liability</h2>
 <p>UK Property Platform acts as a listing platform and does not guarantee the accuracy of information provided by landlords. Users should verify all details independently.</p>
 </div>
 </div>
 );
}
