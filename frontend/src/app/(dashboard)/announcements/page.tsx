"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

type Announcement = { id: string; title: string; content: string; targetAudience: string; publishDate: string; isActive: boolean; createdAt: string; };

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('Admin');
  const isAdvisor = user?.roles?.includes('Advisor');
  const canManage = isAdmin || isAdvisor;

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', targetAudience: 'All' });

  useEffect(() => {
    fetchApi('/api/announcements').then(data => setAnnouncements(data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnn) {
        await fetchApi(`/api/announcements/${editingAnn.id}`, { method: 'PUT', body: JSON.stringify({ ...editingAnn, ...formData }) });
        setAnnouncements(announcements.map(a => a.id === editingAnn.id ? { ...a, ...formData } : a));
      } else {
        const newAnn = await fetchApi('/api/announcements', { method: 'POST', body: JSON.stringify(formData) });
        setAnnouncements([newAnn, ...announcements]);
      }
      closeModal();
    } catch { alert(editingAnn ? 'Duyuru güncellenemedi.' : 'Duyuru eklenemedi.'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;
    try { await fetchApi(`/api/announcements/${id}`, { method: 'DELETE' }); setAnnouncements(announcements.filter(a => a.id !== id)); } catch { alert('Duyuru silinemedi.'); }
  };

  const openEditModal = (ann: Announcement) => {
    setEditingAnn(ann);
    setFormData({ title: ann.title, content: ann.content, targetAudience: ann.targetAudience });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnn(null);
    setFormData({ title: '', content: '', targetAudience: 'All' });
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingAnn ? 'Duyuruyu Düzenle' : 'Yeni Duyuru'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label><input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="Duyuru başlığı..." /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">İçerik</label><textarea required rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className={inputClass + " resize-none"} placeholder="Duyuru içeriğini yazın..." /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Hedef Kitle</label>
                <select value={formData.targetAudience} onChange={e => setFormData({...formData, targetAudience: e.target.value})} className={inputClass}>
                  <option value="All">Herkes</option><option value="Students">Öğrenciler</option><option value="Advisors">Danışmanlar</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">{editingAnn ? 'Güncelle' : 'Yayınla'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Duyurular</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sisteme yayınlanan duyurular.</p>
        </div>
        {canManage && (
          <button onClick={() => { setEditingAnn(null); setFormData({ title: '', content: '', targetAudience: 'All' }); setIsModalOpen(true); }} className="mt-3 sm:mt-0 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />Yeni Duyuru
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3"><Skeleton className="h-28 w-full rounded-xl" /><Skeleton className="h-28 w-full rounded-xl" /></div>
        ) : announcements.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-xl p-12 text-center text-sm text-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-20" />
            Henüz yayınlanmış duyuru yok.
          </div>
        ) : (
          announcements.map((ann, idx) => (
            <div key={ann.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow group animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Megaphone className="h-4 w-4 text-sky-500 shrink-0" />
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{ann.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 pl-6">{ann.content}</p>
                  <div className="flex gap-3 mt-2.5 pl-6">
                    <span className="text-[11px] text-slate-400">{new Date(ann.createdAt || ann.publishDate).toLocaleDateString('tr-TR')}</span>
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${ann.targetAudience === 'All' ? 'bg-slate-100 text-slate-600' : ann.targetAudience === 'Students' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}>
                      {ann.targetAudience === 'All' ? 'Herkes' : ann.targetAudience === 'Students' ? 'Öğrenciler' : 'Danışmanlar'}
                    </span>
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
                    <button onClick={() => openEditModal(ann)} className="p-1.5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
