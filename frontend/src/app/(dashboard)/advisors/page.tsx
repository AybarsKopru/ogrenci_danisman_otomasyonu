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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', title: '', officeLocation: '' });

  const filteredAdvisors = advisors.filter(a => 
    `${a.title} ${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAdv = await fetchApi('/api/advisors', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setAdvisors([...advisors, newAdv]);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', title: '', officeLocation: '' });
    } catch(err) {
      alert('Danışman eklenemedi.');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Bu danışmanı silmek istediğinize emin misiniz?')) return;
    try {
      await fetchApi(`/api/advisors/${id}`, { method: 'DELETE' });
      setAdvisors(advisors.filter(a => a.id !== id));
    } catch(err) {
      alert('Danışman silinemedi.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdvisor) return;
    try {
      const updated = await fetchApi(`/api/advisors/${editingAdvisor.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...editingAdvisor, ...formData })
      });
      setAdvisors(advisors.map(a => a.id === updated.id ? updated : a));
      setIsEditModalOpen(false);
      setEditingAdvisor(null);
    } catch(err) {
      alert('Danışman güncellenemedi.');
    }
  };

  const openEditModal = (adv: Advisor) => {
    setEditingAdvisor(adv);
    setFormData({ firstName: adv.firstName, lastName: adv.lastName, email: adv.email, title: adv.title, officeLocation: adv.officeLocation });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Yeni Danışman Ekle</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Unvan</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ad</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Soyad</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-Posta</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ofis</label>
                <input required type="text" value={formData.officeLocation} onChange={e => setFormData({...formData, officeLocation: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Danışmanı Düzenle</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Unvan</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ad</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Soyad</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-Posta</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ofis</label>
                <input required type="text" value={formData.officeLocation} onChange={e => setFormData({...formData, officeLocation: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-md">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Danışmanlar</h1>
          <p className="text-sm text-card-foreground mt-1">Bölümdeki kayıtlı danışman listesi.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => openEditModal(adv)} className="text-primary hover:text-primary/80">İncele</button>
                      <button onClick={() => handleDelete(adv.id)} className="text-red-500 hover:text-red-700">Sil</button>
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
