"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/students': 'Öğrenciler',
  '/advisors': 'Danışmanlar',
  '/appointments': 'Randevular',
  '/messages': 'Mesajlar',
  '/announcements': 'Duyurular',
  '/notifications': 'Bildirimler',
  '/logs': 'Sistem Logları',
  '/settings': 'Ayarlar',
};

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  const pageTitle = pageTitles[pathname] || (pathname.startsWith('/students/') ? 'Öğrenci Detayı' : 'Sayfa');

  useEffect(() => {
    if (user) {
      fetchApi('/api/notifications/my')
        .then((data: any[]) => {
          setUnreadCount(data ? data.filter(n => !n.isRead).length : 0);
        })
        .catch(() => {});
    }
  }, [user, pathname]);

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-base font-semibold text-slate-900">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-danger text-white text-[9px] font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
