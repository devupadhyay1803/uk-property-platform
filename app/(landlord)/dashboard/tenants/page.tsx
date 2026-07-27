import type { Metadata } from 'next';
import { getMyTenants } from '@/lib/queries/landlord';

export const metadata: Metadata = { title: 'My Tenants' };

export default async function LandlordTenantsPage() {
  const tenants = await getMyTenants();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-sans text-slate-900">My Tenants</h1>
      </div>

      {tenants.length === 0 ? (
        <div className="border border-slate-200 bg-white">
          <p className="text-lg italic font-sans text-slate-400 text-center py-4">
            No tenants linked to your properties yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">
              <tr>
                <th className="px-4 py-3">Tenant Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tenants.map((t) => {
                const property = (t as Record<string, unknown>).properties as { title: string; city: string } | null;
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {t.full_name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      <div className="flex flex-col gap-1">
                        {t.email ? (
                          <a href={`mailto:${t.email}`} className="hover:text-slate-900 hover:underline">
                            {t.email}
                          </a>
                        ) : (
                          <span className="italic text-slate-400">No email</span>
                        )}
                        {t.phone && <span>{t.phone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {property ? `${property.title} (${property.city})` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold ${
                        t.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : t.status === 'pending' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
