"use client";

import Link from "next/link";
import { Users, Calendar, Megaphone, Bell, BarChart3, Settings, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Öğrenciler', href: '/students', icon: Users, roles: ['Admin', 'Advisor'] },
    { name: 'Danışmanlar', href: '/advisors', icon: BookOpen, roles: ['Admin'] },
    { name: 'Randevular', href: '/appointments', icon: Calendar, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Duyurular', href: '/announcements', icon: Megaphone, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Bildirimler', href: '/notifications', icon: Bell, roles: ['Admin', 'Advisor', 'Student'] },
    { name: 'Ayarlar', href: '/settings', icon: Settings, roles: ['Admin', 'Advisor', 'Student'] },
  ];

  const filteredNav = navigation.filter(item => 
    !user || !item.roles || item.roles.some(role => user.roles?.includes(role))
  );

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="text-xl font-bold text-primary">
          {user?.roles?.includes('Student') ? 'Öğrenci Portal' : 'Danışman Portal'}
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
                className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-card-foreground hover:bg-slate-100 hover:text-primary'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
