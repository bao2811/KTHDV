"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getRoleName = (role: any) => {
    if (typeof role === "string") return role;
    return role?.name || "";
  };

  const isHr = getRoleName(user?.role) === "Admin" || getRoleName(user?.role) === "HR";
  const isCandidate = getRoleName(user?.role) === "Candidate";

  return (
    <header className="bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-variant/30 fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 font-sans">
      <div className="flex items-center gap-12">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-on-surface">
          Nexus Talent
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          <Link 
            href="/" 
            className={`text-xs font-bold uppercase tracking-widest transition-all ${
              pathname === "/" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Trang chủ
          </Link>
          
          {isCandidate && (
            <Link 
              href="/candidate/jobs" 
              className={`text-xs font-bold uppercase tracking-widest transition-all ${
                pathname.startsWith("/candidate") ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Tìm công việc
            </Link>
          )}

          {isHr && (
            <Link 
              href="/hr/jobs" 
              className={`text-xs font-bold uppercase tracking-widest transition-all ${
                pathname.startsWith("/hr") ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Quản lý tuyển dụng
            </Link>
          )}

          {!user && (
            <>
              <Link href="#" className="text-xs font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-widest transition-all">Giải pháp</Link>
              <Link href="#" className="text-xs font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-widest transition-all">Mạng lưới</Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.1em]">
                {getRoleName(user.role)}
              </span>
              <span className="text-xs font-bold text-on-surface">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-surface-variant/50">
              <Link href={isCandidate ? "/candidate/profile" : "/hr/jobs"}>
                {user.profile?.avatarUrl || user.candidateProfile?.avatarUrl ? (
                  <img 
                    src={user.profile?.avatarUrl || user.candidateProfile?.avatarUrl} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-xl object-cover border border-primary/20 hover:border-primary transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 hover:border-primary transition-all">
                    {user.email[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <button 
                onClick={logout}
                className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all"
                title="Đăng xuất"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-5 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-widest transition-all"
            >
              Đăng nhập
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all shadow-md active:scale-95"
            >
              Bắt đầu
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
