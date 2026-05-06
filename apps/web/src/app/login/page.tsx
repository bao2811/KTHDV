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
      const response = await api.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      router.push("/");
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-8">Enter your credentials to access the Executive Suite.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                Corporate Email
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
                Password
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
                <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
              </div>
              <Link href="#" className="text-sm font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">Request Access</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-6">
          <Link href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-all">Privacy Policy</Link>
          <Link href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-all">Terms of Service</Link>
          <Link href="#" className="text-xs text-slate-400 hover:text-slate-900 transition-all">Contact Concierge</Link>
        </div>
      </div>
    </div>
  );
}
