"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // MOCK LOGIN LOGIC
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      let mockRole = 'candidate'; // default
      if (email.includes('admin')) {
        mockRole = 'admin';
      } else if (email.includes('hr')) {
        mockRole = 'hr';
      }

      const mockUser = {
        id: "mock-user-id",
        email: email,
        fullName: `${mockRole.toUpperCase()} User`,
        role: mockRole
      };

      const mockAccessToken = `mock-access-token-${mockRole}`;
      const mockRefreshToken = `mock-refresh-token-${mockRole}`;

      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("accessToken", mockAccessToken);
      localStorage.setItem("refreshToken", mockRefreshToken);
      localStorage.setItem("userRole", mockRole);

      // Redirect to the auth callback page to handle the redirection logic properly
      router.push(`/auth/callback?accessToken=${mockAccessToken}&refreshToken=${mockRefreshToken}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-slate-900 block text-center mb-8">
          Nexus Talent
        </Link>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Chào mừng trở lại</h1>
          <p className="text-slate-500 mb-8">Nhập thông tin đăng nhập để truy cập vào hệ thống.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                Email doanh nghiệp
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="rounded border-slate-300 text-primary focus:ring-primary" />
                <label htmlFor="remember" className="text-sm text-slate-600">Ghi nhớ đăng nhập</label>
              </div>
              <Link href="#" className="text-sm font-bold text-primary hover:underline">Quên mật khẩu?</Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">Yêu cầu quyền truy cập</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-6">
          <Link href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-all">Chính sách bảo mật</Link>
          <Link href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-all">Điều khoản dịch vụ</Link>
          <Link href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-all">Liên hệ hỗ trợ</Link>
        </div>
      </div>
    </div>
  );
}
