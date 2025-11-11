"use client";

import { apiGet, apiPost } from "@/libs/clientAxios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  exp: number;
  iat?: number;
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      // server baca cookie HttpOnly -> kembalikan user
      const data = await apiGet<{ user: User }>("/v1/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    // server set cookie access+refresh via Set-Cookie HttpOnly
    await apiPost("/v1/auth/login", { email, password });
    await refreshUser();
    router.push("/dashboard/admin"); // sesuaikan tujuanmu
  };

  const logout = async () => {
    // server hapus cookie HttpOnly
    await apiPost("/v1/auth/logout");
    setUser(null);
    router.replace("/auth"); // atau /login
  };

  useEffect(() => {
    (async () => {
      await refreshUser();
      setIsLoadingAuth(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoadingAuth,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
