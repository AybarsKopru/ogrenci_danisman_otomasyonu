"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

type User = {
  id: string;
  email: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/login') {
      router.push('/login');
      setLoading(false);
      return;
    }

    if (token) {
      fetchApi('/api/account/me')
        .then((data) => {
          if (data) {
            setUser(data);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          if (pathname !== '/login') router.push('/login');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
