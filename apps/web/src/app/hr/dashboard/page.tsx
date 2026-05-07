'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockStats = {
  activeJobs: 15,
  pendingJobs: 5,
  totalApplicants: 128,
  interviewsThisWeek: 12,
};

const mockRecentJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React/Next.js)',
    type: 'FULL_TIME',
    applicants: 45,
    status: 'ACTIVE',
    createdAt: '2026-05-01',
  },
  {
    id: 'job-2',
    title: 'Backend Engineer (Node.js/NestJS)',
    type: 'REMOTE',
    applicants: 32,
    status: 'ACTIVE',
    createdAt: '2026-04-28',
  },
  {
    id: 'job-3',
    title: 'Product Manager',
    type: 'FULL_TIME',
    applicants: 0,
    status: 'PENDING',
    createdAt: '2026-05-06',
  },
  {
    id: 'job-4',
    title: 'UI/UX Designer',
    type: 'FULL_TIME',
    applicants: 51,
    status: 'CLOSED',
    createdAt: '2026-03-15',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Đang tuyển</span>;
    case 'PENDING':
      return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Chờ duyệt</span>;
    case 'CLOSED':
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Đã đóng</span>;
    case 'DRAFT':
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">Bản nháp</span>;
    default:
      return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{status}</span>;
  }
};

export default function HRDashboard() {
  const [userName, setUserName] = useState<string>('HR');

  useEffect(() => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Tuyển Dụng</h1>
          <p className="text-slate-500 mt-1">Xin chào {userName}, chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/hr/pipeline" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Xem Pipeline
          </Link>
          <Link href="/hr/jobs/create" className="px-4 py-2 bg-[#3525cd] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center">
            <span className="material-symbols-outlined text-[18px] mr-1">add</span>
            Tạo tin mới
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-[#3525cd] p-6 rounded-xl shadow-md text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 font-medium text-sm">Tin đang tuyển</p>
              <h3 className="text-3xl font-bold mt-1">{mockStats.activeJobs}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <span className="material-symbols-outlined text-white">work</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium text-sm">Chờ duyệt</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{mockStats.pendingJobs}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium text-sm">Tổng ứng viên</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{mockStats.totalApplicants}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <span className="material-symbols-outlined">group</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium text-sm">Phỏng vấn tuần này</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{mockStats.interviewsThisWeek}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <span className="material-symbols-outlined">calendar_clock</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Chart Mock (using divs) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Phễu tuyển dụng</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium">Đã nộp</span>
                <span className="font-bold text-slate-900">128</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium">Đã khớp</span>
                <span className="font-bold text-slate-900">64</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium">Phỏng vấn</span>
                <span className="font-bold text-slate-900">24</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 font-medium">Offer</span>
                <span className="font-bold text-slate-900">8</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Tin tuyển dụng gần đây</h2>
            <Link href="/hr/jobs" className="text-sm text-[#3525cd] font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-3 font-medium">Vị trí</th>
                  <th className="px-6 py-3 font-medium">Loại</th>
                  <th className="px-6 py-3 font-medium">Ứng viên</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRecentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 line-clamp-1">{job.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{job.createdAt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{job.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{job.applicants}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
