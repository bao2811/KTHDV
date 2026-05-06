"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", { 
        email, 
        password,
        fullName 
      });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Request Access</h1>
          <p className="text-slate-500 mb-8">Join the world's most distinguished executive talent network.</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Eleanor Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                Create Password
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
              <p className="text-[10px] text-slate-400 mt-2">At least 8 characters, including 1 uppercase, 1 lowercase and 1 number.</p>
            </div>
            
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" required />
              <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                I agree to the <Link href="#" className="font-bold text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="font-bold text-primary hover:underline">Discretionary Agreement</Link>.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing Request..." : "Apply for Access"}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
