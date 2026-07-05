import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, getToken, setToken, clearToken } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('profenglish_user');
    if (getToken() && stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch {
        clearToken();
        localStorage.removeItem('profenglish_user');
      }
    }
    setLoading(false);
  }, []);

  function persistUser(u: User) {
    setUserState(u);
    localStorage.setItem('profenglish_user', JSON.stringify(u));
  }

  async function login(email: string, password: string) {
    const { token, user: u } = await api.login(email, password);
    setToken(token);
    persistUser(u);
  }

  async function register(email: string, password: string) {
    const { token, user: u } = await api.register(email, password);
    setToken(token);
    persistUser(u);
  }

  function logout() {
    clearToken();
    localStorage.removeItem('profenglish_user');
    setUserState(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser: persistUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
