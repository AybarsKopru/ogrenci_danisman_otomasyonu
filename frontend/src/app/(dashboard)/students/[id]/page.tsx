"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, User, Calendar, FileText, BookOpen, Mail } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'appointments' | 'meetings' | 'courses'>('appointments');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, aptData, meetData, courseData] = await Promise.all([
          fetchApi(`/api/students/${studentId}`),
          fetchApi('/api/appointments'),
          fetchApi(`/api/meetings/student/${studentId}`),
          fetchApi(`/api/courses/student/${studentId}`),
        ]);
        setStudent(studentData);
        setAppointments((aptData || []).filter((a: any) => a.studentId === studentId));
        setMeetings(meetData || []);
        setCourses(courseData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Graduated': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Suspended': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const aptStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700';
      case 'Pending': return 'bg-amber-50 text-amber-700';
      case 'Completed': return 'bg-sky-50 text-sky-700';
      case 'Rejected': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!student) {
    return <div className="text-center py-20 text-slate-500">Öğrenci bulunamadı.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Link href="/students" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Öğrenci Listesine Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase">
              {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-3">{student.firstName} {student.lastName}</h2>
            <span className={`mt-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${statusColor(student.status)}`}>
              {student.status}
            </span>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">No: <span className="font-medium text-slate-800">{student.studentNumber}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600 truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">Kayıt: {new Date(student.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button onClick={() => setTab('appointments')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === 'appointments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Calendar className="h-4 w-4 inline mr-1.5 -mt-0.5" />Randevular ({appointments.length})
            </button>
            <button onClick={() => setTab('meetings')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === 'meetings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <FileText className="h-4 w-4 inline mr-1.5 -mt-0.5" />Görüşmeler ({meetings.length})
            </button>
            <button onClick={() => setTab('courses')} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${tab === 'courses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <BookOpen className="h-4 w-4 inline mr-1.5 -mt-0.5" />Dersler ({courses.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            {tab === 'appointments' && (
              appointments.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">Bu öğrenciye ait randevu bulunamadı.</div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {appointments.map(apt => (
                    <li key={apt.id} className="px-5 py-3.5 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{apt.notes || 'Randevu'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(apt.appointmentDate).toLocaleString('tr-TR')}</p>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${aptStatusColor(apt.status)}`}>
                        {apt.status === 'Approved' ? 'Onaylı' : apt.status === 'Pending' ? 'Bekliyor' : apt.status === 'Completed' ? 'Tamamlandı' : 'Reddedildi'}
                      </span>
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === 'meetings' && (
              meetings.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">Henüz görüşme kaydı yok.</div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {meetings.map(m => (
                    <li key={m.id} className="px-5 py-4">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-primary">{new Date(m.meetingDate).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{m.meetingNotes}</p>
                      {m.actionItems && (
                        <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-100">
                          <strong>Aksiyon:</strong> {m.actionItems}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === 'courses' && (
              courses.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">Henüz ders kaydı yok.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kod</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ders Adı</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">AKTS</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dönem</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Not</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {courses.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-medium text-slate-800">{c.code}</td>
                          <td className="px-5 py-3 text-slate-600">{c.name}</td>
                          <td className="px-5 py-3 text-slate-600">{c.credits}</td>
                          <td className="px-5 py-3 text-slate-500">{c.semester}</td>
                          <td className="px-5 py-3 font-medium text-slate-800">{c.grade || '-'}</td>
                          <td className="px-5 py-3">
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${c.status === 'Geçti' ? 'bg-emerald-50 text-emerald-700' : c.status === 'Kaldı' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
