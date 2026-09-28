"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

type Announcement = {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
};

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isStudent = user?.roles?.includes('Student');
  const isAdmin = user?.roles?.includes('Admin');
  const isAdvisor = user?.roles?.includes('Advisor');

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchApi('/api/announcements')
      .then(data => setAnnouncements(data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAnn = await fetchApi('/api/announcements', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          publishedDate: new Date().toISOString()
        })
      });
      setAnnouncements([...announcements, newAnn]);
      setIsModalOpen(false);
      setFormData({ title: '', content: '' });
    } catch(err) {
      alert('Duyuru paylaşılamadı.');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Duyuruyu silmek istediğinize emin misiniz?')) return;
    try {
      await fetchApi(`/api/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch(err) {
      alert('Duyuru silinemedi.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingAnn) return;
    try {
      const updatedAnn = { ...editingAnn, title: formData.title, content: formData.content };
      await fetchApi(`/api/announcements/${editingAnn.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedAnn)
      });
      setAnnouncements(announcements.map(a => a.id === updatedAnn.id ? updatedAnn : a));
      setIsEditModalOpen(false);
      setEditingAnn(null);
    } catch(err) {
      alert('Duyuru güncellenemedi.');
    }
  };

  const openEditModal = (ann: Announcement) => {
    setEditingAnn(ann);
    setFormData({ title: ann.title, content: ann.content });
    setIsEditModalOpen(true);
  };

  const canManage = isAdmin || isAdvisor;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Yeni Duyuru</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-md focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İçerik</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border p-2 rounded-md focus:ring-primary focus:border-primary" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Yayınla</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Duyuruyu Düzenle</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded-md focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İçerik</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border p-2 rounded-md focus:ring-primary focus:border-primary" />
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
          <h1 className="text-2xl font-bold text-foreground">Duyurular</h1>
          <p className="text-sm text-card-foreground mt-1">Üniversite ve bölüm duyurularını buradan takip edebilirsiniz.</p>
        </div>
        {canManage && (
          <div className="mt-4 sm:mt-0">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              Yeni Duyuru
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : announcements.length === 0 ? (
           <div className="bg-card border border-border rounded-xl p-8 text-center text-slate-500">
             Henüz yayınlanmış bir duyuru bulunmuyor.
           </div>
        ) : (
          announcements.sort((a,b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()).map((ann) => (
            <div key={ann.id} className="bg-card border border-border rounded-xl p-5 shadow-sm group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-foreground">{ann.title}</h3>
                    {canManage && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(ann)} className="text-slate-400 hover:text-primary transition-colors text-sm font-medium">Düzenle</button>
                        <button onClick={() => handleDelete(ann.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{ann.content}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span>{new Date(ann.publishedDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
