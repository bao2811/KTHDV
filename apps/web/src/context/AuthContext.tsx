"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

interface User {
  id: number;
  email: string;
  role:
    | string
    | {
        id?: number;
        name?: string;
        permissions?: Array<{ resource: string; action: string }>;
      };
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
  hasPermission: (resource: string, action?: string) => boolean;
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
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // Trust stored user data immediately for better UX
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }

      try {
        // Verify/Refresh user data in background
        const userData = await authService.getMe();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error: any) {
        console.error("Session verification failed", error);
        // Only logout if it's a definitive auth error (401)
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Remove logout dependency to prevent unnecessary re-runs

  const login = useCallback(
    (userData: User, accessToken: string, refreshToken: string) => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    [],
  );

  const isAuthenticated = !!user;

  const getRoleName = (role: any) => {
    if (typeof role === "string") return role;
    return role?.name || "";
  };

  const isAdmin =
    getRoleName(user?.role) === "Admin" || getRoleName(user?.role) === "HR";
  const isCandidate = getRoleName(user?.role) === "Candidate";

  const hasPermission = (resource: string, action = "read") => {
    const roleName = getRoleName(user?.role);
    if (roleName === "Admin") return true;
    if (!user?.role || typeof user.role === "string") return false;

    return (
      user.role.permissions?.some(
        (permission) =>
          permission.resource === resource && permission.action === action,
      ) || false
    );
  };

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
        hasPermission,
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
