"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, GraduationCap, Shield, BookOpen, Users } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchApi("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        router.push("/");
      } else {
        setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı veya hatalı şifre.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
    setLoading(true);
    try {
      const data = await fetchApi("/login", {
        method: "POST",
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      if (data && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        router.push("/");
      } else {
        setError("Giriş başarısız.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-teal-300/20 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-6">Öğrenci Danışman<br />Otomasyon Sistemi</h1>
          <p className="text-teal-200 mt-3 text-sm leading-relaxed max-w-sm">
            Öğrenci-danışman ilişkilerini dijitalleştirin, randevuları yönetin ve akademik süreci verimli takip edin.
          </p>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-sm text-teal-100">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">📅</div>
            <span>Kolay randevu yönetimi</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-teal-100">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">💬</div>
            <span>Anlık mesajlaşma ve bildirimler</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-teal-100">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">📊</div>
            <span>Akademik süreç takibi</span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-lg font-bold text-slate-900">Danışman Otomasyonu</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Hoş Geldiniz</h2>
            <p className="mt-1 text-sm text-slate-500">Portala erişmek için giriş yapın.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="ornek@universite.edu.tr"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Giriş Yap"}
            </button>
          </form>

          {/* Quick Login Cards */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Hızlı Test Girişi</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin@uni.edu.tr', 'Admin123!')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <Shield className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-slate-600 group-hover:text-primary">Admin</span>
              </button>
              <button
                onClick={() => quickLogin('danisman@uni.edu.tr', 'Advisor123!')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <BookOpen className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-slate-600 group-hover:text-primary">Danışman</span>
              </button>
              <button
                onClick={() => quickLogin('ogrenci@uni.edu.tr', 'Student123!')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <Users className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-slate-600 group-hover:text-primary">Öğrenci</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
