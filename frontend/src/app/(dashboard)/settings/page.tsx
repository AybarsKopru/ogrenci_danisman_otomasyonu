"use client";

import { useState } from "react";
import { User, Bell, Shield, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetchApi('/api/account/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setMessage('Şifre başarıyla değiştirildi.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage('Şifre değiştirilemedi. Mevcut şifreniz yanlış olabilir.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-sm text-card-foreground mt-1">Hesap ve sistem tercihlerinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <User className="h-4 w-4" />
            Profil
          </button>
          <button onClick={() => setActiveTab('password')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'password' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Key className="h-4 w-4" />
            Şifre Değiştir
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Bell className="h-4 w-4" />
            Bildirimler
          </button>
        </div>

        <div className="md:col-span-3 bg-card border border-border rounded-xl shadow-sm">
          {activeTab === 'profile' && (
            <>
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-medium text-foreground">Profil Bilgileri</h2>
                <p className="text-sm text-slate-500 mt-1">Kişisel bilgilerinizi buradan görüntüleyebilirsiniz.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-Posta Adresi</label>
                    <input type="email" disabled value={user?.email || ''} className="w-full px-3 py-2 border rounded-md bg-slate-50 text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                    <input type="text" disabled value={user?.roles?.join(', ') || ''} className="w-full px-3 py-2 border rounded-md bg-slate-50 text-slate-500" />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'password' && (
            <>
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-medium text-foreground">Şifre Değiştir</h2>
                <p className="text-sm text-slate-500 mt-1">Hesap güvenliğiniz için şifrenizi güncelleyin.</p>
              </div>
              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                {message && <div className="p-3 text-sm bg-slate-100 text-slate-700 rounded-md">{message}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Şifre</label>
                  <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary/90">
                    Şifreyi Güncelle
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Bildirim Tercihleri</h2>
              <p className="text-sm text-slate-500">Bildirim ayarları yapım aşamasındadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
