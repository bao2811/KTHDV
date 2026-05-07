'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React/Next.js)',
    company: 'NexusTech',
    type: 'FULL_TIME',
    salary: '20M - 45M VND',
    applicants: 45,
    status: 'ACTIVE',
  },
  {
    id: 'job-2',
    title: 'Backend Engineer (Node.js)',
    company: 'Global Solutions',
    type: 'REMOTE',
    salary: '25M - 50M VND',
    applicants: 32,
    status: 'ACTIVE',
  },
  {
    id: 'job-3',
    title: 'Product Manager',
    company: 'InnoTech',
    type: 'FULL_TIME',
    salary: '30M - 60M VND',
    applicants: 0,
    status: 'PENDING',
  },
  {
    id: 'job-4',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    type: 'FULL_TIME',
    salary: '15M - 30M VND',
    applicants: 51,
    status: 'CLOSED',
  },
  {
    id: 'job-5',
    title: 'Marketing Specialist',
    company: 'NexusTech',
    type: 'PART_TIME',
    salary: '10M - 20M VND',
    applicants: 0,
    status: 'DRAFT',
  },
];

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'DRAFT', label: 'Bản nháp' },
  { id: 'PENDING', label: 'Chờ duyệt' },
  { id: 'ACTIVE', label: 'Đang tuyển' },
  { id: 'CLOSED', label: 'Đã đóng' },
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

export default function HRJobsManagement() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = mockJobs.filter(job => {
    const matchesFilter = activeFilter === 'ALL' || job.status === activeFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý tin tuyển dụng</h1>
          <p className="text-slate-500 mt-1">Tạo mới, chỉnh sửa và theo dõi các chiến dịch tuyển dụng.</p>
        </div>
        <div>
          <Link href="/hr/jobs/create" className="px-4 py-2.5 bg-[#3525cd] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] mr-1.5">add</span>
            Tạo tin mới
          </Link>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex overflow-x-auto pb-2 lg:pb-0 -mb-2 lg:-mb-0 hide-scrollbar space-x-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.id 
                  ? 'bg-indigo-50 text-[#3525cd]' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề, công ty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-80 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] focus:bg-white transition-all text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">Tiêu đề & Công ty</th>
                <th className="px-6 py-4 font-medium">Loại / Lương</th>
                <th className="px-6 py-4 font-medium">Ứng viên</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy tin tuyển dụng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{job.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{job.type}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{job.salary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-full text-sm">
                        {job.applicants}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {job.status === 'ACTIVE' && (
                          <button className="p-1.5 text-slate-400 hover:text-[#3525cd] hover:bg-indigo-50 rounded-md transition-colors" title="Xem danh sách ứng viên">
                            <span className="material-symbols-outlined text-[20px]">group</span>
                          </button>
                        )}
                        <Link href={`/hr/jobs/${job.id}/edit`} className="p-1.5 text-slate-400 hover:text-[#3525cd] hover:bg-indigo-50 rounded-md transition-colors" title="Chỉnh sửa">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
