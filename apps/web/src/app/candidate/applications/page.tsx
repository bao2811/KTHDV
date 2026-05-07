'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockApplications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer (React/Next.js)',
    companyName: 'NexusTech',
    companyLogo: 'N',
    appliedAt: '2026-05-01',
    status: 'INTERVIEWING',
    matchScore: 92,
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Backend Engineer (Node.js)',
    companyName: 'Global Solutions',
    companyLogo: 'G',
    appliedAt: '2026-04-28',
    status: 'SUBMITTED',
    matchScore: null,
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'UI/UX Product Designer',
    companyName: 'Creative Studio',
    companyLogo: 'C',
    appliedAt: '2026-04-15',
    status: 'OFFERED',
    matchScore: 88,
  },
  {
    id: 'app-4',
    jobId: 'job-4',
    jobTitle: 'DevOps Engineer',
    companyName: 'CloudCorp',
    companyLogo: 'C',
    appliedAt: '2026-04-10',
    status: 'REJECTED',
    matchScore: 65,
  },
  {
    id: 'app-5',
    jobId: 'job-5',
    jobTitle: 'Fullstack Developer',
    companyName: 'TechStart',
    companyLogo: 'T',
    appliedAt: '2026-05-05',
    status: 'MATCHED',
    matchScore: 85,
  },
];

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'SUBMITTED', label: 'Chờ duyệt' },
  { id: 'MATCHED', label: 'Đã khớp' },
  { id: 'INTERVIEWING', label: 'Phỏng vấn' },
  { id: 'OFFERED', label: 'Nhận offer' },
  { id: 'REJECTED', label: 'Bị từ chối' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUBMITTED':
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">Chờ duyệt</span>;
    case 'MATCHED':
      return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Đã khớp</span>;
    case 'INTERVIEWING':
      return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Phỏng vấn</span>;
    case 'OFFERED':
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Nhận offer</span>;
    case 'REJECTED':
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Bị từ chối</span>;
    default:
      return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{status}</span>;
  }
};

export default function CandidateApplications() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [applications, setApplications] = useState(mockApplications);

  const filteredApps = activeFilter === 'ALL' 
    ? applications 
    : applications.filter(app => app.status === activeFilter);

  const handleCancel = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn ứng tuyển này? Hành động này không thể hoàn tác.')) {
      setApplications(applications.filter(app => app.id !== id));
      alert('Đã hủy đơn ứng tuyển.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Đơn ứng tuyển</h1>
        <p className="text-slate-500 mt-1">Theo dõi trạng thái các công việc bạn đã ứng tuyển.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 -mb-2 hide-scrollbar space-x-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab.id 
                ? 'bg-[#3525cd] text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#3525cd] hover:text-[#3525cd]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">inbox</span>
            <h3 className="text-lg font-bold text-slate-900">Không tìm thấy đơn ứng tuyển</h3>
            <p className="text-slate-500 mt-1">Không có đơn ứng tuyển nào khớp với bộ lọc hiện tại.</p>
            <button 
              onClick={() => setActiveFilter('ALL')}
              className="mt-4 px-4 py-2 text-[#3525cd] font-medium hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Công việc & Công ty</th>
                  <th className="px-6 py-4 font-medium">Ngày nộp</th>
                  <th className="px-6 py-4 font-medium">Độ phù hợp</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 flex-shrink-0">
                          {app.companyLogo}
                        </div>
                        <div>
                          <Link href={`/jobs/${app.jobId}`} className="font-bold text-slate-900 hover:text-[#3525cd] transition-colors line-clamp-1">
                            {app.jobTitle}
                          </Link>
                          <div className="text-sm text-slate-500 mt-0.5">{app.companyName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {app.appliedAt}
                    </td>
                    <td className="px-6 py-4">
                      {app.matchScore ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                app.matchScore >= 80 ? 'bg-green-500' : app.matchScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${app.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{app.matchScore}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Đang tính...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-sm font-medium text-[#3525cd] hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors">
                        Chi tiết
                      </button>
                      {app.status === 'SUBMITTED' && (
                        <button 
                          onClick={() => handleCancel(app.id)}
                          className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
