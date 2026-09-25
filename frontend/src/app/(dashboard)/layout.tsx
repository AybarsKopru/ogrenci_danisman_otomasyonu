"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-slate-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex bg-background w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
