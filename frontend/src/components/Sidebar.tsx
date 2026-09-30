"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Calendar, Megaphone, Bell, BarChart3, Settings, BookOpen, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApi('/api/notifications/my')
        .then((data: any[]) => {
          if (data && data.some(n => !n.isRead)) {
            setHasUnread(true);
          } else {
            setHasUnread(false);
          }
        })
        .catch(() => {});
    }
  }, [user, pathname]); // Re-check when pathname changes (e.g. going to notifications page)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Öğrenciler', href: '/students', icon: Users, roles: ['Admin', 'Advisor'] },
    { name: 'Danışmanlar', href: '/advisors', icon: BookOpen, roles: ['Admin'] },
    { name: 'Randevular', href: '/appointments', icon: Calendar, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Duyurular', href: '/announcements', icon: Megaphone, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Bildirimler', href: '/notifications', icon: Bell, roles: ['Admin', 'Advisor', 'Student'], showBadge: hasUnread },
    { name: 'Sistem Logları', href: '/logs', icon: Activity, roles: ['Admin'] },
    { name: 'Ayarlar', href: '/settings', icon: Settings, roles: ['Admin', 'Advisor', 'Student'] },
  ];

  const filteredNav = navigation.filter(item => 
    !user || !item.roles || item.roles.some(role => user.roles?.includes(role))
  );

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="text-xl font-bold text-primary">
          {user?.roles?.includes('Student') ? 'Öğrenci Portal' : user?.roles?.includes('Advisor') ? 'Danışman Portal' : 'Admin Portal'}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-primary hover:translate-x-1'}`}
              >
                <div className="relative">
                  <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.showBadge && (
                    <span className="absolute top-0 right-3 -mt-1 -mr-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
