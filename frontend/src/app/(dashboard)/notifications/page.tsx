"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/api/notifications/my')
      .then(data => setNotifications(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await fetchApi(`/api/notifications/${id}/read`, { method: 'PUT' }).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await fetchApi('/api/notifications/read-all', { method: 'PUT' }).catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bildirimler</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="mt-3 sm:mt-0 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
            <CheckCheck className="h-4 w-4" />
            Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            <Bell className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm">Hiç bildiriminiz bulunmuyor.</p>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div
              key={notif.id}
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              className={`px-5 py-4 rounded-xl border flex items-start gap-3 transition-all duration-200 animate-slide-up ${
                notif.isRead
                  ? 'bg-white border-slate-100 cursor-default'
                  : 'bg-primary/[0.03] border-primary/20 cursor-pointer hover:border-primary/30'
              }`}
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              <div className="mt-1.5 shrink-0">
                {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                {notif.isRead && <div className="h-2 w-2 rounded-full bg-slate-200" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                  {notif.title}
                </h4>
                <p className={`text-sm mt-0.5 ${notif.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                  {notif.message}
                </p>
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  {new Date(notif.createdAt).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
