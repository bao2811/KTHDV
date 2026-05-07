'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockJobs = [
  {
    id: 'job-1',
    title: 'Kỹ sư Frontend Cao cấp',
    department: 'Kỹ thuật',
    reqCode: 'Yêu cầu #4920 • Hà Nội, VN',
    icon: 'code',
    applicants: 42,
    status: 'ACTIVE',
  },
  {
    id: 'job-2',
    title: 'Quản lý Tiếp thị Sản phẩm',
    department: 'Marketing',
    reqCode: 'Yêu cầu #4925 • Từ xa',
    icon: 'campaign',
    applicants: 0,
    status: 'DRAFT',
  },
  {
    id: 'job-3',
    title: 'Đại diện Hỗ trợ Khách hàng',
    department: 'Vận hành',
    reqCode: 'Yêu cầu #4810 • TP.HCM, VN',
    icon: 'support_agent',
    applicants: 128,
    status: 'CLOSED',
  },
];

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả công việc' },
  { id: 'ACTIVE', label: 'Đang hoạt động' },
  { id: 'DRAFT', label: 'Bản nháp' },
];

export default function JobManagement() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredJobs = mockJobs.filter(job => {
    return activeFilter === 'ALL' || job.status === activeFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full -mx-container-padding -my-container-padding bg-surface-container-lowest">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center w-full px-container-padding h-16 shrink-0 bg-surface-container-lowest border-b border-surface-variant z-10">
        <div className="flex items-center gap-8">
          <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
            Nexus Talent
          </div>
          <div className="hidden lg:flex items-center bg-surface-container-lowest border border-outline-variant rounded px-4 py-2 w-64 focus-within:border-on-surface transition-colors">
            <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
            <input 
              className="bg-transparent border-none outline-none text-body-sm font-body-sm text-on-surface w-full placeholder-outline focus:ring-0 p-0" 
              placeholder="Tìm kiếm ứng viên hoặc công việc..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded flex items-center justify-center text-on-surface hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 rounded flex items-center justify-center text-on-surface hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="w-9 h-9 rounded bg-surface-variant overflow-hidden cursor-pointer border border-outline-variant ml-2">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
          </div>
        </div>
      </header>

      {/* Page Content Canvas */}
      <main className="p-container-padding flex-1 max-w-7xl mx-auto w-full overflow-y-auto custom-scrollbar">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Quản lý công việc</h1>
            <p className="font-body-md text-body-md text-outline mt-1">Quản lý các yêu cầu tuyển dụng và theo dõi luồng ứng viên.</p>
          </div>
          <Link href="/hr/jobs/create">
            <button className="bg-primary text-on-primary font-label-bold text-label-bold py-3 px-6 rounded hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 self-start sm:self-auto shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Đăng công việc mới
            </button>
          </Link>
        </div>

        {/* Data Table Container (High-end Card UI) */}
        <div className="bg-surface-container-lowest rounded shadow-sm border border-surface-variant overflow-hidden">
          {/* Table Filters/Actions Bar */}
          <div className="p-4 border-b border-surface-variant flex items-center justify-between bg-surface-container-lowest">
            <div className="flex gap-2">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2 text-body-sm font-label-bold rounded transition-colors border ${
                      isActive 
                        ? 'bg-on-surface text-surface-container-lowest border-on-surface' 
                        : 'text-on-surface hover:bg-surface-variant/50 border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button className="text-on-surface hover:text-primary transition-colors flex items-center gap-1 font-body-sm text-body-sm border border-outline-variant px-3 py-1.5 rounded">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Bộ lọc
            </button>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-surface-variant">
                  <th className="p-4 font-label-bold text-label-bold text-outline uppercase tracking-wider w-1/3">Tiêu đề công việc</th>
                  <th className="p-4 font-label-bold text-label-bold text-outline uppercase tracking-wider">Phòng ban</th>
                  <th className="p-4 font-label-bold text-label-bold text-outline uppercase tracking-wider">Trạng thái</th>
                  <th className="p-4 font-label-bold text-label-bold text-outline uppercase tracking-wider">Ứng viên</th>
                  <th className="p-4 font-label-bold text-label-bold text-outline uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {filteredJobs.map((job) => {
                  const isClosed = job.status === 'CLOSED';
                  const opacityClass = isClosed ? 'opacity-60' : '';
                  
                  return (
                    <tr key={job.id} className="hover:bg-surface-variant/20 transition-colors group cursor-default bg-surface-container-lowest">
                      <td className={`p-4 ${opacityClass}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded border border-outline-variant flex items-center justify-center ${isClosed ? 'text-outline' : 'text-on-surface'}`}>
                            <span className="material-symbols-outlined">{job.icon}</span>
                          </div>
                          <div>
                            <p className={`font-label-bold text-label-bold text-[14px] ${isClosed ? 'text-outline line-through' : 'text-on-surface'}`}>
                              {job.title}
                            </p>
                            <p className="font-body-sm text-body-sm text-outline text-[12px] mt-0.5">{job.reqCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`p-4 font-body-sm text-body-sm ${isClosed ? 'text-outline opacity-60' : 'text-on-surface'}`}>
                        {job.department}
                      </td>
                      <td className="p-4">
                        {job.status === 'ACTIVE' && (
                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-label-bold text-primary border border-primary uppercase tracking-wider">
                            Đang hoạt động
                          </span>
                        )}
                        {job.status === 'DRAFT' && (
                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-label-bold text-on-surface border border-on-surface uppercase tracking-wider">
                            Bản nháp
                          </span>
                        )}
                        {job.status === 'CLOSED' && (
                          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-label-bold text-outline border border-outline uppercase tracking-wider">
                            Đã đóng
                          </span>
                        )}
                      </td>
                      <td className={`p-4 ${opacityClass}`}>
                        {job.status === 'DRAFT' ? (
                          <span className="font-label-bold text-label-bold text-outline">—</span>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="font-label-bold text-label-bold text-on-surface w-6">{job.applicants}</span>
                            <div className="w-24 h-1.5 bg-surface-variant overflow-hidden">
                              <div className={`h-full ${isClosed ? 'bg-outline' : 'bg-primary'}`} style={{ width: `${Math.min(job.applicants, 100)}%` }}></div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {job.status !== 'DRAFT' && (
                            <button className="p-2 text-outline hover:text-on-surface rounded transition-colors border border-transparent hover:border-outline-variant" title={isClosed ? 'Xem báo cáo' : 'Xem ứng viên'}>
                              <span className="material-symbols-outlined text-[20px]">{isClosed ? 'assessment' : 'groups'}</span>
                            </button>
                          )}
                          {!isClosed && (
                            <button className="p-2 text-outline hover:text-on-surface rounded transition-colors border border-transparent hover:border-outline-variant" title="Sửa">
                              <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                          )}
                          {job.status === 'ACTIVE' && (
                            <button className="p-2 text-outline hover:text-on-surface rounded transition-colors border border-transparent hover:border-outline-variant" title="Đóng công việc">
                              <span className="material-symbols-outlined text-[20px]">block</span>
                            </button>
                          )}
                          {job.status === 'DRAFT' && (
                            <button className="p-2 text-outline hover:text-on-surface rounded transition-colors border border-transparent hover:border-outline-variant" title="Xóa">
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-surface-variant bg-surface-container-lowest flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-outline">Hiển thị từ 1 đến {filteredJobs.length} trong số {mockJobs.length} mục</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-outline hover:border-outline-variant transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-on-surface bg-on-surface text-surface-container-lowest font-label-bold text-label-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-on-surface hover:border-outline-variant transition-colors font-label-bold text-label-bold">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-transparent text-outline hover:border-outline-variant transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
