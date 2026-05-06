"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_2px_rgba(30,41,59,0.02)] fixed top-0 w-full z-50 flex justify-between items-center px-8 py-3 h-16 font-sans text-sm tracking-tight">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-extrabold tracking-tighter text-slate-900">
          Nexus Talent
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-indigo-600 font-semibold">Home</Link>
          <Link href="#" className="text-slate-500 hover:text-slate-900 transition-all duration-200">Solutions</Link>
          <Link href="#" className="text-slate-500 hover:text-slate-900 transition-all duration-200">Talent Pool</Link>
          <Link href="#" className="text-slate-500 hover:text-slate-900 transition-all duration-200">Pricing</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-primary uppercase">{user.role}</span>
              <span className="text-sm font-medium text-slate-900">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              Logout
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold overflow-hidden border border-indigo-200">
              {user.email[0].toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
