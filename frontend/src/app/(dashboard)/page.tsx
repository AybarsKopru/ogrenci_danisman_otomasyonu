"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Calendar, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchApi('/api/reports/dashboard-stats')
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const statCards = [
    { name: 'Toplam Öğrenci', value: stats?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Aktif Danışman', value: stats?.totalAdvisors || 0, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Bekleyen Randevu', value: stats?.pendingAppointments || 0, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hoş Geldiniz, {user?.roles?.includes('Admin') ? 'Yönetici' : user?.email}</h1>
        <p className="text-sm text-card-foreground mt-1">Portal özet istatistikleriniz aşağıdadır.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
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
    </div>
  );
}
