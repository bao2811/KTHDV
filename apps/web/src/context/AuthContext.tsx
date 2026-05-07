"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";


interface User {
  id: number;
  email: string;
  role: string | any;
  fullName?: string;
  profile?: any;
  candidateProfile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCandidate: boolean;
  refreshUser: () => Promise<void>;
  getRoleName: (role: any) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Session restoration failed", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [logout]);

  const login = useCallback((userData: User, accessToken: string, refreshToken: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }, []);

  const isAuthenticated = !!user;
  
  const getRoleName = (role: any) => {
    if (typeof role === "string") return role;
    return role?.name || "";
  };

  const isAdmin = getRoleName(user?.role) === "Admin" || getRoleName(user?.role) === "HR";
  const isCandidate = getRoleName(user?.role) === "Candidate";

  const refreshUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to refresh user", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isCandidate,
        refreshUser,
        getRoleName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
