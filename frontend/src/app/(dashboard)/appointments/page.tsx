"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, XCircle, Clock4, Search, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";

type Appointment = {
  id: string;
  student: { firstName: string; lastName: string };
  advisor: { firstName: string; lastName: string };
  appointmentDate: string;
  status: string;
  notes?: string;
};

const getStatusText = (status: string) => {
  switch(status) { case 'Approved': return 'Onaylandı'; case 'Pending': return 'Onay Bekliyor'; case 'Completed': return 'Tamamlandı'; case 'Rejected': return 'Reddedildi'; default: return status; }
};

const getStatusBadge = (status: string) => {
  switch(status) { case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'; case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200'; case 'Completed': return 'bg-sky-50 text-sky-700 border-sky-200'; case 'Rejected': return 'bg-red-50 text-red-700 border-red-200'; default: return 'bg-slate-50 text-slate-700 border-slate-200'; }
};

const getStatusIcon = (status: string) => {
  switch(status) { case 'Approved': return <CheckCircle2 className="h-3.5 w-3.5" />; case 'Rejected': return <XCircle className="h-3.5 w-3.5" />; case 'Completed': return <CheckCircle2 className="h-3.5 w-3.5" />; default: return <Clock4 className="h-3.5 w-3.5" />; }
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const isStudent = user?.roles?.includes('Student');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchApi('/api/appointments')
      .then(data => setAppointments(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/api/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify(newStatus) });
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch { alert("Durum güncellenemedi."); }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', notes: '' });

  const filteredAppointments = appointments.filter(apt => {
    const matchSearch = apt.student ? `${apt.student.firstName} ${apt.student.lastName}`.toLowerCase().includes(search.toLowerCase()) : true;
    const matchStatus = statusFilter === 'All' ? true : apt.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();
      const newApt = await fetchApi('/api/appointments', { method: 'POST', body: JSON.stringify({ appointmentDate: dateTime, notes: formData.notes, status: 'Pending' }) });
      setAppointments([...appointments, newApt]);
      setIsModalOpen(false);
      setFormData({ date: '', time: '', notes: '' });
    } catch { alert('Randevu talebi gönderilemedi.'); }
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Randevu Talep Et</h2>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label><input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Saat</label><input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Not / Konu</label><textarea required rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={inputClass + " resize-none"} placeholder="Görüşmek istediğiniz konuyu kısaca özetleyin..." /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Talep Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Randevular</h1>
          <p className="text-sm text-slate-500 mt-0.5">{isStudent ? 'Danışmanınızla planlanan randevularınız.' : 'Öğrencilerle planlanan randevularınız.'}</p>
        </div>
        {isStudent && (
          <button onClick={() => setIsModalOpen(true)} className="mt-3 sm:mt-0 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />Randevu Talep Et
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all" placeholder="Öğrenci veya danışman ara..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="block w-full sm:w-44 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
          <option value="All">Tüm Durumlar</option><option value="Pending">Onay Bekleyenler</option><option value="Approved">Onaylananlar</option><option value="Completed">Tamamlananlar</option><option value="Rejected">Reddedilenler</option>
        </select>
      </div>

      {/* Appointment List */}
      <div className="grid gap-3">
        {loading ? (
          <div className="space-y-3"><Skeleton className="h-24 w-full rounded-xl" /><Skeleton className="h-24 w-full rounded-xl" /><Skeleton className="h-24 w-full rounded-xl" /></div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-xl p-12 text-center text-sm text-slate-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
            Kayıtlı randevu bulunamadı.
          </div>
        ) : (
          filteredAppointments.map((apt, idx) => {
            const dateObj = new Date(apt.appointmentDate);
            return (
              <div key={apt.id}
                   className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow animate-slide-up"
                   style={{ animationDelay: `${idx * 0.03}s` }}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center text-sm font-medium text-slate-900">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    {isStudent
                      ? (apt.advisor ? `Danışman: ${apt.advisor.firstName} ${apt.advisor.lastName}` : 'Bilinmeyen Danışman')
                      : (apt.student ? `Öğrenci: ${apt.student.firstName} ${apt.student.lastName}` : 'Bilinmeyen Öğrenci')}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" />{dateObj.toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                  <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md border ${getStatusBadge(apt.status)}`}>
                    {getStatusIcon(apt.status)}
                    {getStatusText(apt.status)}
                  </span>

                  {!isStudent && apt.status === 'Pending' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleStatusUpdate(apt.id, 'Approved')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium border border-emerald-200 transition-colors">Onayla</button>
                      <button onClick={() => handleStatusUpdate(apt.id, 'Rejected')} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium border border-red-200 transition-colors">Reddet</button>
                    </div>
                  )}
                  {!isStudent && apt.status === 'Approved' && (
                    <button onClick={() => handleStatusUpdate(apt.id, 'Completed')} className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-medium shadow-sm transition-colors">Görüşme Başlat</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
