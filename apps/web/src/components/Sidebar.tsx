'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type SidebarProps = {
  role: 'candidate' | 'hr' | 'admin';
  isCollapsed: boolean;
  onToggle: () => void;
};

const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'hr':
      return [
        { label: 'Tổng quan', href: '/hr', icon: 'dashboard' },
        { label: 'Tin tuyển dụng', href: '/hr/jobs', icon: 'work' },
        { label: 'Pipeline', href: '/hr/pipeline', icon: 'view_kanban' },
        { label: 'Ứng viên', href: '/hr/candidates', icon: 'group' },
        { label: 'Phỏng vấn', href: '/hr/interviews', icon: 'event' },
        { label: 'Duyệt tin', href: '/hr/jobs/approvals', icon: 'fact_check' },
        { label: 'Cài đặt', href: '/hr/settings', icon: 'settings' },
      ];
    case 'admin':
      return [
        { label: 'Bảng điều khiển', href: '/admin', icon: 'dashboard' },
        { label: 'Duyệt tin', href: '/admin/jobs/approvals', icon: 'fact_check' },
        { label: 'Tin tuyển dụng', href: '/admin/jobs', icon: 'work' },
        { label: 'Công ty', href: '/admin/companies', icon: 'domain' },
        { label: 'Dữ liệu gốc', href: '/admin/master-data', icon: 'database' },
        { label: 'Người dùng', href: '/admin/users', icon: 'manage_accounts' },
        { label: 'Referral', href: '/admin/referrals', icon: 'how_to_reg' },
        { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: 'settings' },
      ];
    case 'candidate':
    default:
      return [
        { label: 'Bảng điều khiển', href: '/candidate', icon: 'dashboard' },
        { label: 'Tìm việc làm', href: '/candidate/jobs', icon: 'search' },
        { label: 'Đơn ứng tuyển', href: '/candidate/applications', icon: 'description' },
        { label: 'Phỏng vấn', href: '/candidate/interviews', icon: 'event' },
        { label: 'Hồ sơ/CV', href: '/candidate/resumes', icon: 'description' },
        { label: 'Trang cá nhân', href: '/candidate/profile', icon: 'person' },
      ];
  }
};

export default function Sidebar({ role, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = getNavItems(role);

  const avatarUrl = user?.candidateProfile?.avatarUrl || user?.profile?.avatarUrl;
  const displayName = user?.fullName || user?.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav className={`h-screen fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container flex flex-col p-3 transition-all duration-300 hidden md:flex border-r border-outline-variant/20 z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Sidebar Header & Toggle */}
      <div className="mb-6 relative flex items-center justify-between px-2 h-10">
        {!isCollapsed && (
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="font-headline-sm text-headline-sm font-black text-primary truncate animate-in fade-in duration-500">Nexus Talent</h1>
          </Link>
        )}
        <button 
          onClick={onToggle}
          className={`p-2 rounded-xl hover:bg-surface-container-high transition-all text-on-surface-variant ${isCollapsed ? 'mx-auto' : ''}`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isCollapsed ? 'double_arrow' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto custom-scrollbar mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${role}`);
          const isProfile = item.label === 'Trang cá nhân';
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ''}
              className={`group flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 relative ${
                isCollapsed ? 'justify-center' : 'gap-3'
              } ${
                isActive 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/20' 
                  : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
              }`}
            >
              {/* Special Icon for Profile: Use Avatar */}
              {isProfile ? (
                <div className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-8 h-8' : 'w-6 h-6'} rounded-full overflow-hidden border-2 flex items-center justify-center ${isActive ? 'border-white' : 'border-primary/20'} bg-primary-container text-on-primary-container font-bold text-[10px]`}>
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
              ) : (
                <span className="material-symbols-outlined text-[24px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
              )}

              {!isCollapsed && (
                <span className="font-bold text-sm truncate animate-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}

              {/* Active Indicator Tooltip for Collapsed State */}
              {isCollapsed && isActive && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className={`mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant/20 ${isCollapsed ? 'items-center' : ''}`}>
        <Link
          href="/login"
          onClick={() => localStorage.clear()}
          title={isCollapsed ? 'Đăng xuất' : ''}
          className={`group flex items-center p-3 rounded-xl cursor-pointer text-error hover:bg-error/10 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'gap-3'
          }`}
        >
          <span className="material-symbols-outlined">logout</span>
          {!isCollapsed && <span className="font-bold text-sm">Đăng xuất</span>}
        </Link>
        
        {!isCollapsed && role === 'hr' && (
          <button className="w-full bg-primary text-on-primary rounded-xl py-3 px-4 font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Đăng tin
          </button>
        )}
      </div>
    </nav>
  );
}
