'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockJob = {
  id: 'job-1',
  title: 'Senior Frontend Developer (React/Next.js)',
  stats: {
    total: 45,
    matched: 12,
    interviewing: 5,
    offered: 1
  }
};

const mockApplicants = [
  { id: 'c-1', name: 'Nguyễn Văn A', email: 'a@test.com', score: 95, status: 'SUBMITTED', date: '01/05/2026' },
  { id: 'c-2', name: 'Trần Thị B', email: 'b@test.com', score: 80, status: 'SUBMITTED', date: '02/05/2026' },
  { id: 'c-3', name: 'Lê Văn C', email: 'c@test.com', score: 88, status: 'MATCHED', date: '01/05/2026' },
  { id: 'c-4', name: 'Phạm Thị D', email: 'd@test.com', score: 92, status: 'INTERVIEWING', date: '28/04/2026' },
  { id: 'c-5', name: 'Vũ Văn E', email: 'e@test.com', score: 85, status: 'OFFERED', date: '20/04/2026' },
  { id: 'c-6', name: 'Hoàng Văn F', email: 'f@test.com', score: null, status: 'SUBMITTED', date: '05/05/2026' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUBMITTED':
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">Đã nộp</span>;
    case 'MATCHED':
      return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">So khớp</span>;
    case 'INTERVIEWING':
      return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Phỏng vấn</span>;
    case 'OFFERED':
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Nhận Offer</span>;
    case 'REJECTED':
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">Từ chối</span>;
    default:
      return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{status}</span>;
  }
};

export default function JobApplicantsList() {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isMatching, setIsMatching] = useState(false);

  const filteredApplicants = activeFilter === 'ALL' 
    ? applicants 
    : applicants.filter(a => a.status === activeFilter);

  const handleRunMatch = (id: string) => {
    // Giả lập chạy so khớp cho 1 ứng viên
    const btn = document.getElementById(`btn-match-${id}`);
    if (btn) btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">refresh</span>';
    
    setTimeout(() => {
      setApplicants(prev => prev.map(c => {
        if (c.id === id) {
          return { ...c, score: Math.floor(Math.random() * 40) + 60 }; // Random 60-100
        }
        return c;
      }));
    }, 1500);
  };

  const handleRunAll = () => {
    setIsMatching(true);
    setTimeout(() => {
      setApplicants(prev => prev.map(c => {
        if (c.score === null) {
          return { ...c, score: Math.floor(Math.random() * 40) + 60 };
        }
        return c;
      }));
      setIsMatching(false);
      alert('Đã chạy so khớp cho tất cả ứng viên mới!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
        <Link href="/hr/jobs" className="hover:text-[#3525cd]">Tin tuyển dụng</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-slate-900 font-medium">Danh sách ứng viên</span>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{mockJob.title}</h1>
          <p className="text-slate-500 mt-1">Danh sách ứng viên đã nộp hồ sơ cho vị trí này.</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/hr/pipeline" 
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <span className="material-symbols-outlined text-[18px] mr-1">view_kanban</span>
            Xem Kanban
          </Link>
          <button 
            onClick={handleRunAll}
            disabled={isMatching}
            className="px-4 py-2 bg-[#3525cd] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center disabled:opacity-50"
          >
            {isMatching ? (
              <><span className="material-symbols-outlined animate-spin text-[18px] mr-1">refresh</span> Đang chạy...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px] mr-1">psychology</span> Chạy so khớp (Tất cả)</>
            )}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Tổng ứng viên</p>
          <p className="text-2xl font-bold text-slate-900">{mockJob.stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Đã khớp (>60%)</p>
          <p className="text-2xl font-bold text-blue-600">{mockJob.stats.matched}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Phỏng vấn</p>
          <p className="text-2xl font-bold text-amber-600">{mockJob.stats.interviewing}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Offer</p>
          <p className="text-2xl font-bold text-green-600">{mockJob.stats.offered}</p>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto hide-scrollbar">
          {['ALL', 'SUBMITTED', 'MATCHED', 'INTERVIEWING', 'OFFERED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === status 
                  ? 'bg-[#3525cd] text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-[#3525cd]'
              }`}
            >
              {status === 'ALL' ? 'Tất cả' : getStatusBadge(status).props.children}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-medium">Ứng viên</th>
                <th className="px-6 py-4 font-medium">Ngày nộp</th>
                <th className="px-6 py-4 font-medium">Match Score</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{candidate.name}</div>
                    <div className="text-sm text-slate-500">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{candidate.date}</td>
                  <td className="px-6 py-4">
                    {candidate.score !== null ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${candidate.score >= 80 ? 'bg-green-500' : candidate.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{candidate.score}</span>
                      </div>
                    ) : (
                      <button 
                        id={`btn-match-${candidate.id}`}
                        onClick={() => handleRunMatch(candidate.id)}
                        className="text-xs px-2 py-1 bg-indigo-50 text-[#3525cd] font-medium rounded hover:bg-indigo-100 transition-colors flex items-center"
                      >
                        <span className="material-symbols-outlined text-[14px] mr-1">psychology</span>
                        So khớp ngay
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(candidate.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-[#3525cd] hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors">
                      Chi tiết CV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
