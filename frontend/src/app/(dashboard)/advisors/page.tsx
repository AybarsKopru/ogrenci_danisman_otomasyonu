"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Loader2 } from "lucide-react";

export default function AdvisorsPage() {
  const [loading, setLoading] = useState(false);
  const advisors = [
    { id: 1, name: 'Prof. Dr. Ahmet Hoca', email: 'danisman@uni.edu.tr', studentsCount: 15, department: 'Bilgisayar Müh.' },
    { id: 2, name: 'Doç. Dr. Ayşe Yılmaz', email: 'ayse@uni.edu.tr', studentsCount: 8, department: 'Yazılım Müh.' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Danışmanlar</h1>
          <p className="text-sm text-card-foreground mt-1">Sisteme kayıtlı akademisyen ve danışmanların listesi.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            Yeni Danışman
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              placeholder="Danışman ara..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">E-Posta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bölüm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Öğrenci Sayısı</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {advisors.map((adv) => (
                <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">{adv.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{adv.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{adv.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {adv.studentsCount} Öğrenci
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => alert('Detaylar gösterilecek')} className="text-primary hover:text-primary/80">İncele</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
