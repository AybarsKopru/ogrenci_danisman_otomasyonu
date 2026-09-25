import Link from "next/link";
import { Users, Calendar, Megaphone, Bell, BarChart3, Settings, BookOpen } from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Öğrenciler', href: '/students', icon: Users },
  { name: 'Danışmanlar', href: '/advisors', icon: BookOpen },
  { name: 'Randevular', href: '/appointments', icon: Calendar },
  { name: 'Duyurular', href: '/announcements', icon: Megaphone },
  { name: 'Bildirimler', href: '/notifications', icon: Bell },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="text-xl font-bold text-primary">Danışman Portal</div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-card-foreground hover:bg-slate-100 hover:text-primary transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
