"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  status: string;
};

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('Admin');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApi('/api/students')
      .then(data => setStudents(data || []))
      .catch(err => console.error("Error fetching students:", err))
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

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.studentNumber.includes(search)
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStudent = await fetchApi('/api/students', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setStudents([...students, newStudent]);
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', studentNumber: '', email: '', status: 'Active' });
    } catch(err) {
      alert('Öğrenci eklenemedi.');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) return;
    try {
      await fetchApi(`/api/students/${id}`, { method: 'DELETE' });
      setStudents(students.filter(s => s.id !== id));
    } catch(err) {
      alert('Öğrenci silinemedi.');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      const updatedStudent = { ...editingStudent, ...formData };
      await fetchApi(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedStudent)
      });
      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      setIsEditModalOpen(false);
      setEditingStudent(null);
    } catch(err) {
      alert('Öğrenci güncellenemedi.');
    }
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
    } catch(err) {
      console.error(err);
    } finally {
      setLoadingMeetings(false);
    }
  };

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForMeeting) return;
    try {
      const newMeeting = await fetchApi('/api/meetings', {
        method: 'POST',
        body: JSON.stringify({
          studentId: selectedStudentForMeeting.id,
          advisorId: selectedStudentForMeeting.advisorId,
          meetingDate: new Date(meetingForm.date).toISOString(),
          meetingNotes: meetingForm.notes,
          actionItems: meetingForm.actionItems
        })
      });
      setMeetings([newMeeting, ...meetings]);
      setMeetingForm({ date: '', notes: '', actionItems: '' });
    } catch(err) {
      alert('Görüşme kaydedilemedi.');
    }
  };

  return (
    <div className="space-y-6">

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Yeni Öğrenci Ekle</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Soyad</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Öğrenci No</label>
                <input required type="text" value={formData.studentNumber} onChange={e => setFormData({...formData, studentNumber: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-Posta</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Öğrenciyi Düzenle</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad</label>
                <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Soyad</label>
                <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Öğrenci No</label>
                <input required type="text" value={formData.studentNumber} onChange={e => setFormData({...formData, studentNumber: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-Posta</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Durum</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border p-2 rounded-md">
                  <option value="Active">Aktif</option>
                  <option value="Graduated">Mezun</option>
                  <option value="Suspended">Uzaklaştırıldı</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-md">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMeetingModalOpen && selectedStudentForMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl my-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{selectedStudentForMeeting.firstName} {selectedStudentForMeeting.lastName} - Görüşme Kayıtları</h2>
              <button onClick={() => setIsMeetingModalOpen(false)} className="text-slate-400 hover:text-slate-600">Kapat</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Yeni Not Ekle</h3>
                <form onSubmit={handleMeetingSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tarih</label>
                    <input required type="date" value={meetingForm.date} onChange={e => setMeetingForm({...meetingForm, date: e.target.value})} className="w-full border p-2 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Görüşme Notları</label>
                    <textarea required rows={4} value={meetingForm.notes} onChange={e => setMeetingForm({...meetingForm, notes: e.target.value})} className="w-full border p-2 rounded-md" placeholder="Konuşulanlar..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Aksiyon Adımları (Action Items)</label>
                    <textarea rows={2} value={meetingForm.actionItems} onChange={e => setMeetingForm({...meetingForm, actionItems: e.target.value})} className="w-full border p-2 rounded-md" placeholder="Örn: CV güncellenecek" />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md w-full">Kaydet</button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Geçmiş Görüşmeler</h3>
                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                  {loadingMeetings ? (
                     <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : meetings.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">Henüz bir görüşme kaydı bulunmuyor.</p>
                  ) : (
                    meetings.map(m => (
                      <div key={m.id} className="bg-slate-50 border rounded-lg p-3 text-sm">
                        <div className="font-medium text-primary mb-1">{new Date(m.meetingDate).toLocaleDateString('tr-TR')}</div>
                        <p className="text-slate-700 whitespace-pre-wrap mb-2">{m.meetingNotes}</p>
                        {m.actionItems && (
                          <div className="bg-yellow-50 text-yellow-800 p-2 rounded mt-2 border border-yellow-200">
                            <strong>Aksiyon:</strong> {m.actionItems}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Öğrenciler</h1>
          <p className="text-sm text-card-foreground mt-1">Sisteme kayıtlı öğrencilerin listesi.</p>
        </div>
        {isAdmin && (
          <div className="mt-4 sm:mt-0">
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              Yeni Öğrenci
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Öğrenci ara (İsim veya numara)..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Öğrenci No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ad Soyad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Durum</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Düzenle</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">{student.studentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{student.firstName} {student.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {(isAdmin || user?.roles?.includes('Advisor')) && (
                        <button onClick={() => openMeetingModal(student)} className="text-emerald-600 hover:text-emerald-700">Kayıtlar</button>
                      )}
                      <button onClick={() => openEditModal(student)} className="text-primary hover:text-primary/80">İncele</button>
                      {isAdmin && <button onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-700">Sil</button>}
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">Kayıtlı öğrenci bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
