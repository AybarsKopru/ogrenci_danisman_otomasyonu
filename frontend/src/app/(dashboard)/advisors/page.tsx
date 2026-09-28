"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Advisor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  officeLocation: string;
};

export default function AdvisorsPage() {
  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApi('/api/advisors')
      .then(data => setAdvisors(data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredAdvisors = advisors.filter(a => 
    `${a.title} ${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Danışmanlar</h1>
          <p className="text-sm text-card-foreground mt-1">Bölümdeki kayıtlı danışman listesi.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => alert('Yeni Danışman ekleme ekranı')} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            Yeni Danışman
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Danışman ara..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ad Soyad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">E-Posta</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ofis</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Düzenle</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredAdvisors.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">{adv.title} {adv.firstName} {adv.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{adv.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{adv.officeLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => alert(`${adv.firstName} düzenleniyor...`)} className="text-primary hover:text-primary/80">İncele</button>
                    </td>
                  </tr>
                ))}
                {filteredAdvisors.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">Kayıt bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
