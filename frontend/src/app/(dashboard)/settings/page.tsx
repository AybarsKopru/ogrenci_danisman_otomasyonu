"use client";

import { User, Bell, Shield, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-sm text-card-foreground mt-1">Hesap ve sistem tercihlerinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
            <User className="h-4 w-4" />
            Profil
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">
            <Bell className="h-4 w-4" />
            Bildirimler
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">
            <Shield className="h-4 w-4" />
            Gizlilik
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-50">
            <Key className="h-4 w-4" />
            Şifre Değiştir
          </button>
        </div>

        <div className="md:col-span-3 bg-card border border-border rounded-xl shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Profil Bilgileri</h2>
            <p className="text-sm text-slate-500 mt-1">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
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
            <div className="pt-4 flex justify-end">
              <button onClick={() => alert('Bilgiler kaydedildi.')} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary/90">
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
