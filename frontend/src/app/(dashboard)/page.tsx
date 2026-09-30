"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Calendar, Clock, Megaphone, ArrowRight, CheckCircle2, GraduationCap, FileText } from "lucide-react";
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

  const statCards = [
    { label: 'Toplam Öğrenci', value: stats?.totalStudents, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Aktif Danışman', value: stats?.totalAdvisors, icon: BookOpen, color: 'bg-teal-50 text-teal-600' },
    { label: 'Bekleyen Randevu', value: stats?.pendingAppointments, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Onaylı Randevu', value: stats?.approvedAppointments, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Toplam Görüşme', value: stats?.totalMeetings, icon: FileText, color: 'bg-violet-50 text-violet-600' },
    { label: 'Aktif Duyuru', value: stats?.totalAnnouncements, icon: Megaphone, color: 'bg-sky-50 text-sky-600' },
  ];

  // Student status distribution bar
  const totalStudents = (stats?.activeStudents || 0) + (stats?.graduatedStudents || 0) + (stats?.suspendedStudents || 0);
  const activePercent = totalStudents > 0 ? Math.round((stats?.activeStudents / totalStudents) * 100) : 0;
  const graduatedPercent = totalStudents > 0 ? Math.round((stats?.graduatedStudents / totalStudents) * 100) : 0;
  const suspendedPercent = totalStudents > 0 ? Math.round((stats?.suspendedStudents / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Hoş Geldiniz{user?.roles?.includes('Admin') ? ', Yönetici' : ''}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Portal özet istatistikleriniz ve güncel durumunuz.</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{card.value ?? 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Status Distribution */}
      {!loading && stats && totalStudents > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Öğrenci Durum Dağılımı
          </h3>
          <div className="flex w-full h-3 rounded-full overflow-hidden bg-slate-100">
            {activePercent > 0 && <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${activePercent}%` }} />}
            {graduatedPercent > 0 && <div className="bg-sky-500 transition-all duration-700" style={{ width: `${graduatedPercent}%` }} />}
            {suspendedPercent > 0 && <div className="bg-red-400 transition-all duration-700" style={{ width: `${suspendedPercent}%` }} />}
          </div>
          <div className="flex gap-6 mt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Aktif ({stats.activeStudents})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Mezun ({stats.graduatedStudents})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Uzaklaştırılmış ({stats.suspendedStudents})</span>
          </div>
        </div>
      )}

      {/* Bottom Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointments */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Bekleyen Randevular
            </h2>
            <Link href="/appointments" className="text-xs text-primary hover:underline flex items-center gap-1">
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1">
            {loading ? (
              <div className="p-5 space-y-3">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            ) : pendingAppointments.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Bekleyen randevu talebi yok.
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {pendingAppointments.map((apt) => (
                  <li key={apt.id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {apt.student ? `${apt.student.firstName} ${apt.student.lastName}` : 'Öğrenci'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{apt.notes}</p>
                      </div>
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        Bekliyor
                      </span>
                    </div>
                    <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(apt.appointmentDate).toLocaleString('tr-TR')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-sky-500" />
              Son Duyurular
            </h2>
            <Link href="/announcements" className="text-xs text-primary hover:underline flex items-center gap-1">
              Tümü <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex-1">
            {loading ? (
              <div className="p-5 space-y-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : recentAnnouncements.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Henüz duyuru yok.
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {recentAnnouncements.map((ann) => (
                  <li key={ann.id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <h3 className="text-sm font-medium text-slate-800">{ann.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      {new Date(ann.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                    </p>
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
