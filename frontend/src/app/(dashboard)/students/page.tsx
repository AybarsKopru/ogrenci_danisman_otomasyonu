"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Loader2, Eye } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  status: string;
  email: string;
  advisorId?: string;
};

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('Admin');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchApi('/api/students')
      .then(data => setStudents(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', studentNumber: '', email: '', status: 'Active' });

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedStudentForMeeting, setSelectedStudentForMeeting] = useState<Student | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingForm, setMeetingForm] = useState({ date: '', notes: '', actionItems: '' });
  const [loadingMeetings, setLoadingMeetings] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) || s.studentNumber.includes(search);
    const matchStatus = statusFilter === 'All' ? true : s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStudent = await fetchApi('/api/students', { method: 'POST', body: JSON.stringify(formData) });
      setStudents([...students, newStudent]);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', studentNumber: '', email: '', status: 'Active' });
    } catch { alert('Öğrenci eklenemedi.'); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) return;
    try {
      await fetchApi(`/api/students/${id}`, { method: 'DELETE' });
      setStudents(students.filter(s => s.id !== id));
    } catch { alert('Öğrenci silinemedi.'); }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const updatedStudent = { ...editingStudent, ...formData };
      await fetchApi(`/api/students/${editingStudent.id}`, { method: 'PUT', body: JSON.stringify(updatedStudent) });
      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      setIsEditModalOpen(false);
      setEditingStudent(null);
    } catch { alert('Öğrenci güncellenemedi.'); }
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({ firstName: student.firstName, lastName: student.lastName, studentNumber: student.studentNumber, email: student.email, status: student.status });
    setIsEditModalOpen(true);
  };

  const openMeetingModal = async (student: Student) => {
    setSelectedStudentForMeeting(student);
    setIsMeetingModalOpen(true);
    setLoadingMeetings(true);
    try {
      const data = await fetchApi(`/api/meetings/student/${student.id}`);
      setMeetings(data || []);
    } catch { /* ignore */ } finally { setLoadingMeetings(false); }
  };

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForMeeting) return;
    try {
      const newMeeting = await fetchApi('/api/meetings', {
        method: 'POST',
        body: JSON.stringify({ studentId: selectedStudentForMeeting.id, advisorId: selectedStudentForMeeting.advisorId, meetingDate: new Date(meetingForm.date).toISOString(), meetingNotes: meetingForm.notes, actionItems: meetingForm.actionItems })
      });
      setMeetings([newMeeting, ...meetings]);
      setMeetingForm({ date: '', notes: '', actionItems: '' });
    } catch { alert('Görüşme kaydedilemedi.'); }
  };

  const statusBadge = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Graduated': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Suspended': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const statusLabel = (status: string) => {
    switch(status) {
      case 'Active': return 'Aktif';
      case 'Graduated': return 'Mezun';
      case 'Suspended': return 'Uzaklaştırıldı';
      default: return status;
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Yeni Öğrenci Ekle</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Ad</label><input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label><input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Öğrenci No</label><input required type="text" value={formData.studentNumber} onChange={e => setFormData({...formData, studentNumber: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200 animate-scale-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Öğrenciyi Düzenle</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Ad</label><input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label><input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Öğrenci No</label><input required type="text" value={formData.studentNumber} onChange={e => setFormData({...formData, studentNumber: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">E-Posta</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={inputClass}>
                  <option value="Active">Aktif</option><option value="Graduated">Mezun</option><option value="Suspended">Uzaklaştırıldı</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {isMeetingModalOpen && selectedStudentForMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl border border-slate-200 animate-scale-in my-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-slate-900">{selectedStudentForMeeting.firstName} {selectedStudentForMeeting.lastName} — Görüşmeler</h2>
              <button onClick={() => setIsMeetingModalOpen(false)} className="text-sm text-slate-400 hover:text-slate-600">Kapat</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Yeni Not Ekle</h3>
                <form onSubmit={handleMeetingSubmit} className="space-y-3">
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label><input required type="date" value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Görüşme Notları</label><textarea required rows={4} value={meetingForm.notes} onChange={e => setMeetingForm({...meetingForm, notes: e.target.value})} className={inputClass + " resize-none"} placeholder="Konuşulanlar..." /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Aksiyon Adımları</label><textarea rows={2} value={meetingForm.actionItems} onChange={e => setMeetingForm({...meetingForm, actionItems: e.target.value})} className={inputClass + " resize-none"} placeholder="Örn: CV güncellenecek" /></div>
                  <button type="submit" className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Kaydet</button>
                </form>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Geçmiş Görüşmeler</h3>
                <div className="max-h-[400px] overflow-y-auto space-y-3">
                  {loadingMeetings ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
                  : meetings.length === 0 ? <p className="text-sm text-slate-400 text-center py-8">Henüz görüşme kaydı yok.</p>
                  : meetings.map(m => (
                    <div key={m.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 text-sm">
                      <div className="font-medium text-primary text-xs mb-1">{new Date(m.meetingDate).toLocaleDateString('tr-TR')}</div>
                      <p className="text-slate-700 whitespace-pre-wrap">{m.meetingNotes}</p>
                      {m.actionItems && <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-md border border-amber-100"><strong>Aksiyon:</strong> {m.actionItems}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Öğrenciler</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sisteme kayıtlı öğrencilerin listesi.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="mt-3 sm:mt-0 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />Yeni Öğrenci
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-slate-400" /></div>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all" placeholder="İsim veya numara ile ara..." />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="block w-full sm:w-40 px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <option value="All">Tüm Durumlar</option>
            <option value="Active">Aktif</option>
            <option value="Graduated">Mezun</option>
            <option value="Suspended">Uzaklaştırılmış</option>
          </select>
        </div>

        {loading ? (
          <div className="p-5 space-y-3"><Skeleton className="h-14 w-full rounded-lg" /><Skeleton className="h-14 w-full rounded-lg" /><Skeleton className="h-14 w-full rounded-lg" /></div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">Kayıtlı öğrenci bulunamadı.</div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden">
              <div className="flex flex-col gap-3 p-4">
                {filteredStudents.map((student, idx) => (
                  <div key={student.id} className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">No: {student.studentNumber}</p>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusBadge(student.status)}`}>{statusLabel(student.status)}</span>
                    </div>
                    <div className="mt-3 flex gap-2 justify-end border-t border-slate-100 pt-3">
                      <Link href={`/students/${student.id}`} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium flex items-center gap-1"><Eye className="h-3 w-3" />Profil</Link>
                      {(isAdmin || user?.roles?.includes('Advisor')) && <button onClick={() => openMeetingModal(student)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium">Kayıtlar</button>}
                      {isAdmin && <button onClick={() => handleDelete(student.id)} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium">Sil</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Öğrenci No</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ad Soyad</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">E-Posta</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase">Durum</th>
                    <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td className="px-5 py-3.5 font-medium text-slate-800">{student.studentNumber}</td>
                      <td className="px-5 py-3.5 text-slate-700">{student.firstName} {student.lastName}</td>
                      <td className="px-5 py-3.5 text-slate-500">{student.email}</td>
                      <td className="px-5 py-3.5"><span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${statusBadge(student.status)}`}>{statusLabel(student.status)}</span></td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Link href={`/students/${student.id}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium"><Eye className="h-3 w-3" />Profil</Link>
                        {(isAdmin || user?.roles?.includes('Advisor')) && <button onClick={() => openMeetingModal(student)} className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">Kayıtlar</button>}
                        {isAdmin && <><button onClick={() => openEditModal(student)} className="text-amber-600 hover:text-amber-700 text-xs font-medium">Düzenle</button><button onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Sil</button></>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
