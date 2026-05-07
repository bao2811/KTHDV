"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter, usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "candidate" | "hr" | "admin";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isJobsPage = pathname === "/candidate/jobs";
  const showGlobalSearch = !pathname?.includes("/jobs");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      <Sidebar
        role={role}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Canvas */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* TopNavBar - Hidden on Jobs Page for Max Space */}
        {!isJobsPage && (
          <header className="flex justify-between items-center w-full px-container-padding h-16 sticky top-0 z-30 bg-surface dark:bg-surface-dim shadow-sm dark:shadow-none">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <button className="md:hidden text-on-surface-variant cursor-pointer transition-transform active:scale-95">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h2 className="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim md:hidden">
                Nexus Talent
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {showGlobalSearch && (
                <div className="relative hidden sm:block">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    search
                  </span>
                  <input
                    className="pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary w-64 font-body-sm text-body-sm text-on-surface placeholder:text-outline-variant outline-none"
                    placeholder="Tìm kiếm ứng viên, công việc..."
                    type="text"
                  />
                </div>
              )}

              <button className="text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors cursor-pointer transition-transform active:scale-95 relative p-2">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto ${!isJobsPage ? "p-container-padding" : "p-6"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
