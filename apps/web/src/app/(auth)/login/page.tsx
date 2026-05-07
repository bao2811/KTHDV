"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.login({ email, password });
      
      const { accessToken, refreshToken, user } = result;
      
      login(user, accessToken, refreshToken);

      // Redirect based on role
      if (user.role === "Admin" || user.role === "HR") {
        router.push("/hr/jobs");
      } else {
        router.push("/candidate/jobs");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/" className="text-3xl font-extrabold tracking-tighter text-on-surface block text-center mb-8">
          Nexus Talent
        </Link>
        
        <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-ambient-card border border-surface-variant/50">
          <h1 className="text-2xl font-bold text-on-surface mb-2">Chào mừng trở lại</h1>
          <p className="text-on-surface-variant mb-8 text-sm">Đăng nhập để quản lý quy trình tuyển dụng và cơ hội nghề nghiệp của bạn.</p>
          
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl text-[13px] mb-6 flex items-start gap-3 border border-error/20">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              label="Email doanh nghiệp"
              type="email"
              placeholder="name@company.com"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              id="password"
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" />
                <label htmlFor="remember" className="text-xs text-on-surface-variant font-medium cursor-pointer">Ghi nhớ</label>
              </div>
              <Link href="#" className="text-xs font-bold text-primary hover:underline">Quên mật khẩu?</Link>
            </div>
            
            <Button
              type="submit"
              className="w-full py-4 text-label-bold uppercase tracking-widest mt-2"
              isLoading={loading}
            >
              Đăng nhập
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-outline-variant/30"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-container-lowest px-4 text-outline font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-outline-variant rounded-xl font-bold text-sm text-on-surface hover:bg-surface-container-low transition-all active:scale-[0.98] shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Google Workplace</span>
          </button>
          
          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-xs font-medium">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">Yêu cầu quyền truy cập</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-10 flex justify-center gap-8">
          <Link href="#" className="text-[11px] font-bold text-outline uppercase tracking-wider hover:text-primary transition-all">Quyền riêng tư</Link>
          <Link href="#" className="text-[11px] font-bold text-outline uppercase tracking-wider hover:text-primary transition-all">Điều khoản</Link>
          <Link href="#" className="text-[11px] font-bold text-outline uppercase tracking-wider hover:text-primary transition-all">Hỗ trợ</Link>
        </div>
      </div>
    </div>
  );
}
