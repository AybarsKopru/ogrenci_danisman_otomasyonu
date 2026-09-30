"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Calendar, Clock, Megaphone, ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const [statsData, aptData, annData] = await Promise.all([
          fetchApi('/api/reports/dashboard-stats'),
          fetchApi('/api/appointments'),
          fetchApi('/api/announcements')
        ]);
        setStats(statsData);
        setAppointments(aptData || []);
        setAnnouncements(annData || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const pendingAppointments = appointments.filter(a => a.status === 'Pending').slice(0, 5);
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hoş Geldiniz, {user?.roles?.includes('Admin') ? 'Yönetici' : user?.email}</h1>
        <p className="text-sm text-slate-500 mt-1">Portal özet istatistikleriniz ve güncel durumunuz aşağıdadır.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-xl bg-card border border-border shadow-sm p-6 flex items-center transition-transform hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Toplam Öğrenci</p>
              <p className="text-2xl font-semibold text-slate-900">{stats?.totalStudents || 0}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-card border border-border shadow-sm p-6 flex items-center transition-transform hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-indigo-100 mr-4">
              <BookOpen className="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Aktif Danışman</p>
              <p className="text-2xl font-semibold text-slate-900">{stats?.totalAdvisors || 0}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-card border border-border shadow-sm p-6 flex items-center transition-transform hover:-translate-y-1">
            <div className="p-3 rounded-lg bg-orange-100 mr-4">
              <Calendar className="h-6 w-6 text-orange-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Bekleyen Randevu</p>
              <p className="text-2xl font-semibold text-slate-900">{stats?.pendingAppointments || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bekleyen Randevular */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col animate-slide-up">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Bekleyen Randevular
            </h2>
            <Link href="/appointments" className="text-sm text-primary hover:underline flex items-center">
              Tümünü Gör <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 p-0">
            {loading ? (
              <div className="p-5 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : pendingAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-20" />
                Bekleyen randevu talebi bulunmuyor.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pendingAppointments.map((apt) => (
                  <li key={apt.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {apt.student ? `${apt.student.firstName} ${apt.student.lastName}` : 'Öğrenci'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{apt.notes}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                        Bekliyor
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(apt.appointmentDate).toLocaleString('tr-TR')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Son Duyurular */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-500" />
              Son Duyurular
            </h2>
            <Link href="/announcements" className="text-sm text-primary hover:underline flex items-center">
              Tümünü Gör <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 p-0">
            {loading ? (
              <div className="p-5 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentAnnouncements.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-20" />
                Henüz duyuru bulunmuyor.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentAnnouncements.map((ann) => (
                  <li key={ann.id} className="p-5 hover:bg-slate-50 transition-colors">
                    <h3 className="text-sm font-medium text-slate-900">{ann.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                    <div className="mt-2 text-xs text-slate-400">
                      {new Date(ann.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
