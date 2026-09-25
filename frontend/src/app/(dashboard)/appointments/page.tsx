import { Calendar as CalendarIcon, Clock, User, CheckCircle2, XCircle, Clock4 } from "lucide-react";

const appointments = [
  { id: 1, studentName: 'Ahmet Yılmaz', date: '12 Mayıs 2026', time: '14:30', status: 'Pending', statusText: 'Onay Bekliyor' },
  { id: 2, studentName: 'Ayşe Demir', date: '12 Mayıs 2026', time: '16:00', status: 'Approved', statusText: 'Onaylandı' },
  { id: 3, studentName: 'Mehmet Kaya', date: '11 Mayıs 2026', time: '09:15', status: 'Completed', statusText: 'Tamamlandı' },
];

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Approved': return <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />;
    case 'Pending': return <Clock4 className="h-4 w-4 text-orange-500 mr-1.5" />;
    case 'Completed': return <CheckCircle2 className="h-4 w-4 text-blue-500 mr-1.5" />;
    default: return <XCircle className="h-4 w-4 text-red-500 mr-1.5" />;
  }
}

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Randevular</h1>
        <p className="text-sm text-card-foreground mt-1">Öğrencilerle planlanan randevularınız ve talepler.</p>
      </div>

      <div className="grid gap-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-foreground font-medium text-lg">
                <User className="h-5 w-5 mr-2 text-slate-400" />
                {apt.studentName}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  {apt.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" />
                  {apt.time}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
              <div className="flex items-center text-sm font-medium px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                {getStatusIcon(apt.status)}
                <span className="text-slate-700">{apt.statusText}</span>
              </div>
              {apt.status === 'Pending' && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium transition-colors border border-green-200">
                    Onayla
                  </button>
                  <button className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm font-medium transition-colors border border-red-200">
                    Reddet
                  </button>
                </div>
              )}
              {apt.status === 'Approved' && (
                <button className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Görüşme Başlat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
