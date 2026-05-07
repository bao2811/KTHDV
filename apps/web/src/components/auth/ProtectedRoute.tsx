"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getRoleName = (role: any) => {
      if (typeof role === "string") return role;
      return role?.name || "";
    };

    if (!loading) {
      const roleName = getRoleName(user?.role).toLowerCase();
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRoles) {
        const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
        
        if (!normalizedAllowedRoles.includes(roleName)) {
          // Redirect to a default page based on role
          if (roleName === "candidate") {
            router.push("/candidate/jobs");
          } else if (roleName === "admin" || roleName === "hr") {
            router.push("/hr/jobs");
          } else {
            console.warn("User has unknown role:", roleName);
            router.push("/");
          }
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-[40px]">refresh</span>
          <p className="text-sm font-medium text-on-surface-variant animate-pulse">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // If roles are specified, check if user has one of them
  const getRoleName = (role: any) => {
    if (typeof role === "string") return role;
    return role?.name || "";
  };

  if (allowedRoles && user) {
    const roleName = getRoleName(user.role).toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    if (!normalizedAllowedRoles.includes(roleName)) {
      return null; // Will redirect in useEffect
    }
  }

  return <>{children}</>;
}
