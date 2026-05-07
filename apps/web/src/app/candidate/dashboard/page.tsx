'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockStats = {
  total: 12,
  pending: 3,
  interviewing: 2,
  offered: 1,
};

const mockRecentApplications = [
  {
    id: 'app-1',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'NexusTech',
    appliedAt: '2026-05-01',
    status: 'INTERVIEWING',
  },
  {
    id: 'app-2',
    jobTitle: 'Backend Engineer',
    companyName: 'Global Solutions',
    appliedAt: '2026-04-28',
    status: 'SUBMITTED',
  },
  {
    id: 'app-3',
    jobTitle: 'UI/UX Designer',
    companyName: 'Creative Studio',
    appliedAt: '2026-04-15',
    status: 'OFFERED',
  },
  {
    id: 'app-4',
    jobTitle: 'Product Manager',
    companyName: 'InnoTech',
    appliedAt: '2026-04-10',
    status: 'REJECTED',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUBMITTED':
      return <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">Chờ duyệt</span>;
    case 'MATCHED':
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Đã khớp</span>;
    case 'INTERVIEWING':
      return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Phỏng vấn</span>;
    case 'OFFERED':
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Đã nhận Offer</span>;
    case 'REJECTED':
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Từ chối</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{status}</span>;
  }
};

export default function CandidateDashboard() {
  const [userName, setUserName] = useState<string>('Ứng viên');

  useEffect(() => {
    // Tạm thời lấy tên từ localStorage nếu có
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.email) {
          setUserName(parsed.email.split('@')[0]);
        }
      } catch (e) {}
    }
  }, []);

  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Xin chào, {userName}! 👋</h1>
        <p className="text-slate-500 mt-1">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tổng đơn</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Đang chờ</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.pending}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Phỏng vấn</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.interviewing}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">celebration</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Đã nhận offer</p>
            <p className="text-2xl font-bold text-slate-900">{mockStats.offered}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Đơn ứng tuyển gần đây</h2>
            <Link href="/candidate/applications" className="text-sm text-[#3525cd] font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-3 font-medium">Vị trí</th>
                  <th className="px-6 py-3 font-medium">Công ty</th>
                  <th className="px-6 py-3 font-medium">Ngày nộp</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRecentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{app.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{app.companyName}</td>
                    <td className="px-6 py-4 text-slate-500">{app.appliedAt}</td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 mb-4">
            {/* Simple circular progress mock */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="250" strokeDashoffset="50" className="text-[#3525cd]" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-900">80%</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Hoàn thiện hồ sơ</h3>
          <p className="text-sm text-slate-500 mt-2 mb-4">
            Hồ sơ đầy đủ giúp bạn tăng cơ hội lọt vào mắt xanh của nhà tuyển dụng.
          </p>
          <Link href="/candidate/profile" className="inline-flex items-center justify-center px-4 py-2 bg-[#3525cd] text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors w-full">
            Cập nhật ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
