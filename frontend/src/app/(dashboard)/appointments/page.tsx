"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, XCircle, Clock4, Loader2, Search, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Appointment = {
  id: string;
  student: { firstName: string; lastName: string };
  advisor: { firstName: string; lastName: string };
  appointmentDate: string;
  status: string;
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Approved': return <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />;
    case 'Pending': return <Clock4 className="h-4 w-4 text-orange-500 mr-1.5" />;
    case 'Completed': return <CheckCircle2 className="h-4 w-4 text-blue-500 mr-1.5" />;
    default: return <XCircle className="h-4 w-4 text-red-500 mr-1.5" />;
  }
}

const getStatusText = (status: string) => {
  switch(status) {
    case 'Approved': return 'Onaylandı';
    case 'Pending': return 'Onay Bekliyor';
    case 'Completed': return 'Tamamlandı';
    case 'Rejected': return 'Reddedildi';
    default: return status;
  }
}

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
      .catch(err => console.error("Error fetching appointments:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetchApi(`/api/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(newStatus)
      });
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert("Durum güncellenemedi.");
    }
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
      const newApt = await fetchApi('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ appointmentDate: dateTime, notes: formData.notes, status: 'Pending' })
      });
      setAppointments([...appointments, newApt]);
      setIsModalOpen(false);
      setFormData({ date: '', time: '', notes: '' });
    } catch(err) {
      alert('Randevu talebi gönderilemedi.');
    }
  };

  return (
    <div className="space-y-6">

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Randevu Talep Et</h2>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tarih</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Saat</label>
                <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Not / Konu</label>
                <textarea required rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border p-2 rounded-md" placeholder="Görüşmek istediğiniz konuyu kısaca özetleyin..." />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Talep Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Randevular</h1>
          <p className="text-sm text-card-foreground mt-1">
            {isStudent ? 'Danışmanınızla planlanan randevularınız.' : 'Öğrencilerle planlanan randevularınız ve talepler.'}
          </p>
        </div>
        {isStudent && (
          <div className="mt-4 sm:mt-0">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              Randevu Talep Et
            </button>
          </div>
        )}
      </div>

      <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
            placeholder="Öğrenci veya danışman ara..."
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-border bg-slate-50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          <option value="All">Tüm Durumlar</option>
          <option value="Pending">Onay Bekleyenler</option>
          <option value="Approved">Onaylananlar</option>
          <option value="Completed">Tamamlananlar</option>
          <option value="Rejected">Reddedilenler</option>
        </select>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-slate-500">
            Kayıtlı randevu bulunamadı.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const dateObj = new Date(apt.appointmentDate);
            return (
              <div key={apt.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-foreground font-medium text-lg">
                    <User className="h-5 w-5 mr-2 text-slate-400" />
                    {isStudent 
                      ? (apt.advisor ? `Danışman: ${apt.advisor.firstName} ${apt.advisor.lastName}` : 'Bilinmeyen Danışman')
                      : (apt.student ? `Öğrenci: ${apt.student.firstName} ${apt.student.lastName}` : 'Bilinmeyen Öğrenci')
                    }
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5" />
                      {dateObj.toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5" />
                      {dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center text-sm font-medium px-3 py-1 rounded-full bg-slate-50 border border-slate-100 min-w-[140px] justify-center">
                    {getStatusIcon(apt.status)}
                    <span className="text-slate-700">{getStatusText(apt.status)}</span>
                  </div>
                  
                  {!isStudent && apt.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(apt.id, 'Approved')}
                        className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium transition-colors border border-green-200"
                      >
                        Onayla
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(apt.id, 'Rejected')}
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm font-medium transition-colors border border-red-200"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                  {!isStudent && apt.status === 'Approved' && (
                    <button 
                      onClick={() => handleStatusUpdate(apt.id, 'Completed')}
                      className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors shadow-sm"
                    >
                      Görüşme Başlat
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
