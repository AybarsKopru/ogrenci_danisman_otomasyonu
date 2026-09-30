"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users, Calendar, Megaphone, Bell, BarChart3, Settings,
  BookOpen, Activity, MessageSquare, LogOut, GraduationCap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) {
      fetchApi('/api/notifications/my')
        .then((data: any[]) => {
          setUnreadNotifications(data ? data.filter(n => !n.isRead).length : 0);
        })
        .catch(() => {});

      fetchApi('/api/messages/inbox')
        .then((data: any[]) => {
          setUnreadMessages(data ? data.filter(m => !m.isRead).length : 0);
        })
        .catch(() => {});
    }
  }, [user, pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Öğrenciler', href: '/students', icon: Users, roles: ['Admin', 'Advisor'] },
    { name: 'Danışmanlar', href: '/advisors', icon: BookOpen, roles: ['Admin'] },
    { name: 'Randevular', href: '/appointments', icon: Calendar, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Mesajlar', href: '/messages', icon: MessageSquare, roles: ['Admin', 'Advisor', 'Student'], badge: unreadMessages },
    { name: 'Duyurular', href: '/announcements', icon: Megaphone, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Bildirimler', href: '/notifications', icon: Bell, roles: ['Admin', 'Advisor', 'Student'], badge: unreadNotifications },
    { name: 'Sistem Logları', href: '/logs', icon: Activity, roles: ['Admin'] },
    { name: 'Ayarlar', href: '/settings', icon: Settings, roles: ['Admin', 'Advisor', 'Student'] },
  ];

  const filteredNav = navigation.filter(item =>
    !user || !item.roles || item.roles.some(role => user.roles?.includes(role))
  );

  const portalName = user?.roles?.includes('Student')
    ? 'Öğrenci Portal'
    : user?.roles?.includes('Advisor')
      ? 'Danışman Portal'
      : 'Yönetim Paneli';

  const roleName = user?.roles?.includes('Student')
    ? 'Öğrenci'
    : user?.roles?.includes('Advisor')
      ? 'Danışman'
      : 'Yönetici';

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-100">
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{portalName}</div>
          <div className="text-[11px] text-slate-400">Otomasyon Sistemi</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-0.5">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/8 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && item.badge > 0 && (
                  <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-danger text-white text-[10px] font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
            {user?.email?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-slate-800 truncate">{user?.email}</p>
            <p className="text-[11px] text-slate-400">{roleName}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-md text-slate-400 hover:text-danger hover:bg-red-50 transition-colors"
            title="Çıkış Yap"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
