"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, XCircle, Clock4, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

type Appointment = {
  id: string;
  student: { firstName: string; lastName: string };
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Randevular</h1>
        <p className="text-sm text-card-foreground mt-1">Öğrencilerle planlanan randevularınız ve talepler.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-slate-500">
            Kayıtlı randevu bulunamadı.
          </div>
        ) : (
          appointments.map((apt) => {
            const dateObj = new Date(apt.appointmentDate);
            return (
              <div key={apt.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center text-foreground font-medium text-lg">
                    <User className="h-5 w-5 mr-2 text-slate-400" />
                    {apt.student?.firstName} {apt.student?.lastName}
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
                  <div className="flex items-center text-sm font-medium px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                    {getStatusIcon(apt.status)}
                    <span className="text-slate-700">{getStatusText(apt.status)}</span>
                  </div>
                  {apt.status === 'Pending' && (
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
                  {apt.status === 'Approved' && (
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
