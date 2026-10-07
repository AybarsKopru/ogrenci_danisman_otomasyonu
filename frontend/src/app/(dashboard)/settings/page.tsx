"use client";

import { useState } from "react";
import { User, Key, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await fetchApi('/api/account/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setMessage('Şifre başarıyla değiştirildi.');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setMessage('Şifre değiştirilemedi. Mevcut şifreniz yanlış olabilir.');
      setMessageType('error');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Şifre Değiştir', icon: Key },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Ayarlar</h1>
        <p className="text-sm text-slate-500 mt-0.5">Hesap ve sistem tercihlerinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab Menu */}
        <div className="md:col-span-1 space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/8 text-primary'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {activeTab === 'profile' && (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Profil Bilgileri</h2>
                <p className="text-sm text-slate-500 mt-0.5">Kişisel bilgilerinizi görüntüleyin.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">E-Posta Adresi</label>
                    <input type="email" disabled value={user?.email || ''} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Rol</label>
                    <input type="text" disabled value={user?.roles?.join(', ') || ''} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm" />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'password' && (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Şifre Değiştir</h2>
                <p className="text-sm text-slate-500 mt-0.5">Hesap güvenliğiniz için şifrenizi güncelleyin.</p>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                {message && (
                  <div className={`p-3 text-sm rounded-lg border ${messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {message}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Mevcut Şifre</label>
                  <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Yeni Şifre</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div className="pt-3 flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                    Şifreyi Güncelle
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-base font-semibold text-slate-900 mb-2">Bildirim Tercihleri</h2>
              <p className="text-sm text-slate-500">Bildirim ayarları yapım aşamasındadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
