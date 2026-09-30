"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, Loader2, Info } from "lucide-react";
import { fetchApi } from "@/lib/api";

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

  const fetchNotifications = async () => {
    try {
      const data = await fetchApi('/api/notifications/my');
      setNotifications(data || []);
    } catch (error) {
      console.error("Bildirimler alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetchApi(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetchApi('/api/notifications/read-all', { method: 'PUT' });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bildirimler</h1>
          <p className="text-sm text-card-foreground mt-1">Sistem tarafından size gönderilen bildirimler.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={handleMarkAllAsRead} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Tümünü Okundu İşaretle
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-card rounded-xl border border-dashed border-border">
            <Bell className="h-12 w-12 mb-3 opacity-20" />
            <p>Hiç bildiriminiz bulunmuyor.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-200 ${notif.isRead ? 'bg-card border-border cursor-default' : 'bg-blue-50/50 border-blue-200 cursor-pointer hover:border-blue-300'}`}
            >
              <div className="mt-1 h-2 w-2 rounded-full shrink-0">
                <div className={`h-2 w-2 rounded-full ${notif.isRead ? 'bg-transparent' : 'bg-blue-500 animate-pulse'}`} />
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-semibold mb-1 ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                  {notif.title}
                </h4>
                <p className={`text-sm ${notif.isRead ? 'text-slate-500' : 'text-slate-700'}`}>
                  {notif.message}
                </p>
                <span className="text-xs text-slate-400 mt-2 block">
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
