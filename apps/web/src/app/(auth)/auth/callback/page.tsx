"use client";

import { useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userStr = searchParams.get("user");

    if (accessToken && refreshToken && userStr) {
      try {
        processed.current = true;
        const userData = JSON.parse(userStr);
        
        // Log in the user
        login(userData, accessToken, refreshToken);

        // Redirect based on role
        if (userData.role === "Admin" || userData.role === "HR") {
          router.replace("/hr");
        } else {
          router.replace("/candidate");
        }
      } catch (error) {
        console.error("Failed to parse user data", error);
        router.replace("/login?error=auth_failed");
      }
    } else {
      // If we don't have tokens, don't just redirect immediately if we might be in a loading state
      // but searchParams should be available
      if (searchParams.size > 0) {
        router.replace("/login?error=missing_tokens");
      }
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-semibold text-slate-800">Đang xử lý đăng nhập...</h1>
        <p className="text-slate-500 mt-2">Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
