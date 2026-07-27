import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy policy', description: 'UK Property Platform privacy policy.' };

export default function PrivacyPage() {
 return (
 <div className="mx-auto max-w-3xl px-4 py-12">
 <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy policy</h1>
 <div className="mt-6 space-y-4 text-slate-700 leading-relaxed dark:text-slate-300">
 <p className=" border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">This is a placeholder privacy policy. The final version will be provided by the client and should be reviewed by a legal professional to ensure UK-GDPR compliance.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What data we collect</h2>
 <p>We collect personal information that you provide when submitting an enquiry (name, email, phone number, message) or when creating an account (name, email).</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">How we use your data</h2>
 <p>Your information is used to respond to enquiries, manage tenancy records, and improve our services. We do not sell your data to third parties.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your rights</h2>
 <p>Under UK-GDPR, you have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>
 <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact</h2>
 <p>For privacy-related enquiries, email: privacy@ukpropertyplatform.co.uk</p>
 </div>
 </div>
 );
}
