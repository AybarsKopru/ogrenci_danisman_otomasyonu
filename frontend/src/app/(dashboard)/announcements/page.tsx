"use client";

import { Megaphone, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isStudent = user?.roles?.includes('Student');

  const announcements = [
    { id: 1, title: 'Bahar Dönemi Ders Kayıtları', content: 'Bahar dönemi ders kayıtları 15 Şubat tarihinde başlayacaktır.', date: '10 Şubat 2026', author: 'Öğrenci İşleri' },
    { id: 2, title: 'Mezuniyet Töreni Hakkında', content: 'Mezuniyet töreni detayları ilerleyen günlerde açıklanacaktır.', date: '5 Şubat 2026', author: 'Rektörlük' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Duyurular</h1>
          <p className="text-sm text-card-foreground mt-1">Üniversite ve bölüm duyurularını buradan takip edebilirsiniz.</p>
        </div>
        {!isStudent && (
          <div className="mt-4 sm:mt-0">
            <button onClick={() => alert('Yeni duyuru ekleme formu açılacak')} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="h-4 w-4" />
              Yeni Duyuru
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Megaphone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{ann.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{ann.content}</p>
                <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>{ann.date}</span>
                  <span>•</span>
                  <span>{ann.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
