"use client";

import { Bell, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, message: 'Yeni bir randevu talebiniz var.', time: '10 dakika önce', read: false },
    { id: 2, message: 'Ders kayıt onay işlemleriniz tamamlandı.', time: '2 saat önce', read: true },
    { id: 3, message: 'Danışmanlık sistemine hoş geldiniz.', time: '1 gün önce', read: true }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bildirimler</h1>
          <p className="text-sm text-card-foreground mt-1">Sistem tarafından size gönderilen son bildirimler.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => alert('Tümü okundu işaretlendi.')} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Tümünü Okundu İşaretle
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${notif.read ? 'bg-card border-border' : 'bg-blue-50/50 border-blue-100'}`}>
            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-500'}`} />
            <div className="flex-1">
              <p className={`text-sm ${notif.read ? 'text-card-foreground' : 'text-foreground font-medium'}`}>
                {notif.message}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
