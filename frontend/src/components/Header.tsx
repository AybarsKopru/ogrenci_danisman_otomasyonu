"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center">
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <UserIcon className="h-5 w-5 text-slate-400" />
          <div className="flex flex-col">
            <span>{user?.email || 'Yükleniyor...'}</span>
            <span className="text-xs text-slate-400">{user?.roles?.join(', ')}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Çıkış
        </button>
      </div>
    </header>
  );
}
