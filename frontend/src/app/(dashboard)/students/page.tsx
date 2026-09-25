import { Search, Plus } from "lucide-react";

const students = [
  { id: 1, name: 'Ahmet Yılmaz', number: '2021001', department: 'Bilgisayar Müh.', status: 'Aktif' },
  { id: 2, name: 'Ayşe Demir', number: '2021002', department: 'Yazılım Müh.', status: 'Aktif' },
  { id: 3, name: 'Mehmet Kaya', number: '2021003', department: 'Endüstri Müh.', status: 'Mezun' },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Öğrenciler</h1>
          <p className="text-sm text-card-foreground mt-1">Sisteme kayıtlı öğrencilerin listesi.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            Yeni Öğrenci
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
              placeholder="Öğrenci ara (İsim veya numara)..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Öğrenci No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ad Soyad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bölüm</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Durum</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Düzenle</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">{student.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{student.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-primary hover:text-primary/80">İncele</a>
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
