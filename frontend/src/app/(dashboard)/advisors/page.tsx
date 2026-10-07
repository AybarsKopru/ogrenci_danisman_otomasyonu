"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

type Advisor = { id: string; firstName: string; lastName: string; email: string; title: string; officeLocation: string; };

export default function AdvisorsPage() {
  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApi('/api/advisors').then(data => setAdvisors(data || [])).finally(() => setLoading(false));
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', title: '', officeLocation: '' });

  const filteredAdvisors = advisors.filter(a =>
    `${a.title} ${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAdv = await fetchApi('/api/advisors', { method: 'POST', body: JSON.stringify(formData) });
      setAdvisors([...advisors, newAdv]);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', title: '', officeLocation: '' });
    } catch { alert('Danışman eklenemedi.'); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Bu danışmanı silmek istediğinize emin misiniz?')) return;
    try { await fetchApi(`/api/advisors/${id}`, { method: 'DELETE' }); setAdvisors(advisors.filter(a => a.id !== id)); } catch { alert('Danışman silinemedi.'); }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdvisor) return;
    try {
      const updatedAdvisor = { ...editingAdvisor, ...formData };
      await fetchApi(`/api/advisors/${editingAdvisor.id}`, { method: 'PUT', body: JSON.stringify(updatedAdvisor) });
      setAdvisors(advisors.map(a => a.id === updatedAdvisor.id ? updatedAdvisor : a));
      setIsEditModalOpen(false);
      setEditingAdvisor(null);
    } catch { alert('Danışman güncellenemedi.'); }
  };

  const openEditModal = (adv: Advisor) => {
    setEditingAdvisor(adv);
    setFormData({ firstName: adv.firstName, lastName: adv.lastName, email: adv.email, title: adv.title, officeLocation: adv.officeLocation });
    setIsEditModalOpen(true);
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Yeni Danışman Ekle</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Unvan</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Prof. Dr." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Ad</label><input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label><input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Ofis Konumu</label><input required type="text" value={formData.officeLocation} onChange={e => setFormData({...formData, officeLocation: e.target.value})} className={inputClass} placeholder="A Blok 101" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Danışmanı Düzenle</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Unvan</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Ad</label><input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label><input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Ofis Konumu</label><input required type="text" value={formData.officeLocation} onChange={e => setFormData({...formData, officeLocation: e.target.value})} className={inputClass} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danışmanlar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sisteme kayıtlı akademik danışmanlar.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="mt-3 sm:mt-0 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />Yeni Danışman
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all" placeholder="İsim, unvan veya e-posta ara..." />
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3"><Skeleton className="h-14 w-full rounded-lg" /><Skeleton className="h-14 w-full rounded-lg" /></div>
        ) : filteredAdvisors.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">Kayıtlı danışman bulunamadı.</div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden">
              <div className="flex flex-col gap-3 p-4">
                {filteredAdvisors.map((adv, idx) => (
                  <div key={adv.id} className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                    <p className="font-semibold text-sm text-slate-900">{adv.title} {adv.firstName} {adv.lastName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{adv.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Ofis: {adv.officeLocation}</p>
                    <div className="mt-3 flex gap-2 justify-end border-t border-slate-100 pt-3">
                      <button onClick={() => openEditModal(adv)} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium">Düzenle</button>
                      <button onClick={() => handleDelete(adv.id)} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Unvan & Ad Soyad</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">E-Posta</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ofis</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAdvisors.map((adv, idx) => (
                    <tr key={adv.id} className="hover:bg-slate-50/50 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td className="px-5 py-3.5 font-medium text-slate-800">{adv.title} {adv.firstName} {adv.lastName}</td>
                      <td className="px-5 py-3.5 text-slate-500">{adv.email}</td>
                      <td className="px-5 py-3.5 text-slate-500">{adv.officeLocation}</td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button onClick={() => openEditModal(adv)} className="text-primary hover:text-primary/80 text-xs font-medium">Düzenle</button>
                        <button onClick={() => handleDelete(adv.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
