"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
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
      const result = await authService.register({ 
        email, 
        password,
        fullName 
      });
      
      const { user, accessToken, refreshToken } = result;
      
      // Auto-login after registration
      login(user, accessToken, refreshToken);

      router.push("/candidate/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/" className="text-3xl font-extrabold tracking-tighter text-on-surface block text-center mb-8">
          Nexus Talent
        </Link>
        
        <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-ambient-card border border-surface-variant/50">
          <h1 className="text-2xl font-bold text-on-surface mb-2">Gia nhập mạng lưới</h1>
          <p className="text-on-surface-variant mb-8 text-sm">Bắt đầu hành trình chinh phục các cơ hội nghề nghiệp cấp cao.</p>
          
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl text-[13px] mb-6 flex items-start gap-3 border border-error/20">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="fullName"
              label="Họ và tên"
              type="text"
              placeholder="Eleanor Vance"
              icon="person"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

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
            
            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer" required />
              <label htmlFor="terms" className="text-[11px] text-on-surface-variant leading-relaxed">
                Tôi đồng ý với <Link href="#" className="font-bold text-primary hover:underline">Điều khoản dịch vụ</Link> và <Link href="#" className="font-bold text-primary hover:underline">Thỏa thuận bảo mật dữ liệu</Link>.
              </label>
            </div>
            
            <Button
              type="submit"
              className="w-full py-4 text-label-bold uppercase tracking-widest"
              isLoading={loading}
            >
              Tạo tài khoản
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-outline-variant/30"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-container-lowest px-4 text-outline font-medium">Hoặc đăng ký bằng</span>
            </div>
          </div>

          <button
            onClick={handleGoogleRegister}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-outline-variant rounded-xl font-bold text-sm text-on-surface hover:bg-surface-container-low transition-all active:scale-[0.98] shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Google Workplace</span>
          </button>
          
          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-xs font-medium">
              Đã có tài khoản?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
