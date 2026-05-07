'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type SidebarProps = {
  role: 'candidate' | 'hr' | 'admin';
};

const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'hr':
      return [
        { label: 'Bảng điều khiển', href: '/hr/dashboard', icon: 'dashboard' },
        { label: 'Hồ sơ ứng tuyển', href: '/hr/applications', icon: 'description' },
        { label: 'Phỏng vấn', href: '/hr/interviews', icon: 'event' },
        { label: 'Cài đặt', href: '/hr/settings', icon: 'settings' },
      ];
    case 'admin':
      return [
        { label: 'Bảng điều khiển', href: '/admin', icon: 'dashboard' },
        { label: 'Người dùng', href: '/admin/users', icon: 'manage_accounts' },
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

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container flex flex-col p-4 gap-stack-gap-md hidden md:flex border-r border-outline-variant/20 z-40">
      <div className="mb-stack-gap-lg px-3">
        <h1 className="font-headline-xl text-headline-xl font-bold text-primary">Nexus Talent</h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-bold text-label-bold">
            {role === 'candidate' ? 'CP' : 'HR'}
          </div>
          <div>
            <div className="font-label-bold text-label-bold text-on-surface capitalize">Cổng {role === 'candidate' ? 'Ứng viên' : role === 'hr' ? 'Nhà tuyển dụng' : 'Quản trị'}</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">Gói Doanh nghiệp</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${role}`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-stack-gap-sm p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-secondary-container dark:bg-primary-container text-on-secondary-container dark:text-on-primary-container' 
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 hover:bg-surface-variant/50'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              <span className="font-label-bold text-label-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant/20">
        <Link
          href="/login"
          onClick={() => localStorage.clear()}
          className="group flex items-center gap-stack-gap-sm p-3 rounded-lg cursor-pointer text-error hover:bg-error/10 transition-all duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-bold text-label-bold">Đăng xuất</span>
        </Link>
        {role === 'hr' && (
          <button className="w-full bg-primary text-on-primary rounded-lg py-3 px-4 font-label-bold text-label-bold hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Đăng tin tuyển dụng
          </button>
        )}
      </div>
    </nav>
  );
}
