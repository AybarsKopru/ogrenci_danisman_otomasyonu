import { Users, BookOpen, Calendar } from "lucide-react";

const stats = [
  { name: 'Toplam Öğrenci', value: '1,200', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Aktif Danışman', value: '45', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { name: 'Bekleyen Randevu', value: '12', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hoş Geldiniz</h1>
        <p className="text-sm text-card-foreground mt-1">Danışman portalı özet istatistikleriniz aşağıdadır.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-xl bg-card border border-border shadow-sm p-6 flex items-center"
          >
            <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">{stat.name}</p>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border shadow-sm p-6">
        <h2 className="text-lg font-medium text-foreground mb-4">Son Bildirimler</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="h-2 w-2 mt-2 rounded-full bg-primary mr-3"></div>
            <div>
              <p className="text-sm font-medium text-foreground">Yeni randevu talebi: Ahmet Yılmaz</p>
              <p className="text-xs text-card-foreground">10 dakika önce</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-2 w-2 mt-2 rounded-full bg-slate-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-slate-600">Bahar dönemi ders seçimleri başladı.</p>
              <p className="text-xs text-card-foreground">2 saat önce</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
