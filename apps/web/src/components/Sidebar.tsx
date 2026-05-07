'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
        { label: 'Dashboard', href: '/hr', icon: 'dashboard' },
        { label: 'Jobs', href: '/hr/jobs', icon: 'work' },
        { label: 'Candidates', href: '/hr/candidates', icon: 'group' },
        { label: 'Interviews', href: '/hr/interviews', icon: 'event' },
      ];
    case 'admin':
      return [
        { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
        { label: 'Users', href: '/admin/users', icon: 'manage_accounts' },
        { label: 'System Settings', href: '/admin/settings', icon: 'settings' },
      ];
    case 'candidate':
    default:
      return [
        { label: 'Dashboard', href: '/candidate', icon: 'dashboard' },
        { label: 'Find Jobs', href: '/candidate/jobs', icon: 'search' },
        { label: 'My Applications', href: '/candidate/applications', icon: 'description' },
        { label: 'Interviews', href: '/candidate/interviews', icon: 'event' },
        { label: 'Profile', href: '/candidate/profile', icon: 'person' },
      ];
  }
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm z-10">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <div className="text-2xl font-bold text-[#3525cd] tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined font-light text-3xl">token</span>
          Nexus<span className="text-gray-900 font-medium">Talent</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Main Menu
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== `/${role}`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#3525cd]/5 text-[#3525cd] font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`material-symbols-outlined transition-colors ${isActive ? 'text-[#3525cd]' : 'text-gray-400 group-hover:text-[#3525cd]'}`}>
                {item.icon}
              </span>
              <span className="text-[15px]">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3525cd]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-gray-50">
        <Link
          href="/login"
          onClick={() => localStorage.clear()}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium text-[15px]">Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
