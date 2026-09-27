"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Info } from "lucide-react";
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
    } catch (err) {
      setError("Sunucuya bağlanılamadı veya hatalı şifre.");
      // Development hatalarının Next.js overlay'e düşmemesi için console.error'u kaldırdık.
    } finally {
      setLoading(false);
    }
  };

  // Hızlı giriş için yardımcı fonksiyon
  const fillDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Giriş Yapın
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Öğrenci ve Danışman portalına erişmek için bilgilerinizi girin.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2.5 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                placeholder="ornek@universite.edu.tr"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2.5 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Giriş Yap"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Test Hesapları (Tek tıkla doldur)</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => fillDemoCredentials('admin@uni.edu.tr', 'Admin123!')}
              className="flex justify-between items-center px-3 py-2 text-xs text-left bg-slate-50 hover:bg-primary/5 rounded border border-slate-200 transition-colors"
            >
              <span className="font-semibold text-slate-700">Admin</span>
              <span className="text-slate-500 font-mono">admin@uni.edu.tr</span>
            </button>
            <button 
              onClick={() => fillDemoCredentials('danisman@uni.edu.tr', 'Advisor123!')}
              className="flex justify-between items-center px-3 py-2 text-xs text-left bg-slate-50 hover:bg-primary/5 rounded border border-slate-200 transition-colors"
            >
              <span className="font-semibold text-slate-700">Danışman</span>
              <span className="text-slate-500 font-mono">danisman@uni.edu.tr</span>
            </button>
            <button 
              onClick={() => fillDemoCredentials('ogrenci@uni.edu.tr', 'Student123!')}
              className="flex justify-between items-center px-3 py-2 text-xs text-left bg-slate-50 hover:bg-primary/5 rounded border border-slate-200 transition-colors"
            >
              <span className="font-semibold text-slate-700">Öğrenci</span>
              <span className="text-slate-500 font-mono">ogrenci@uni.edu.tr</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
