'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/types';
import { jobService } from '@/services/job.service';
import { userService } from '@/services/user.service';

import { useAuth } from '@/context/AuthContext';

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ duyệt' },
  { id: 'ACTIVE', label: 'Đang hoạt động' },
  { id: 'DRAFT', label: 'Bản nháp' },
  { id: 'CLOSED', label: 'Đã đóng' },
];

export default function JobManagement() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { jobs, loading, refresh } = useJobs({
    status: activeFilter === 'ALL' ? undefined : activeFilter,
    search: searchQuery || undefined,
  });

  const handleRequestApproval = async (jobId: string | number) => {
    if (!confirm('Bạn có chắc chắn muốn gửi yêu cầu duyệt cho công việc này?')) return;
    try {
      const reviewers = await userService.getReviewers();
      if (reviewers.length === 0) {
        alert('Không tìm thấy người duyệt nào (Admin/Manager)');
        return;
      }
      
      // For now, automatically pick the first reviewer
      const reviewerId = reviewers[0].id;
      
      await jobService.requestApproval(jobId, reviewerId);
      refresh();
      alert('Đã gửi yêu cầu duyệt thành công!');
    } catch (err) {
      alert('Gửi yêu cầu duyệt thất bại');
    }
  };

  const handleCloseJob = async (jobId: string | number) => {
    if (!confirm('Bạn có chắc chắn muốn đóng công việc này?')) return;
    try {
      await jobService.closeJob(jobId);
      refresh();
    } catch (err) {
      alert('Đóng công việc thất bại');
    }
  };

  const handleDeleteJob = async (jobId: string | number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này? Vị trí này sẽ không thể khôi phục.')) return;
    try {
      await jobService.deleteJob(jobId);
      refresh();
    } catch (err) {
      alert('Xóa công việc thất bại');
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'US';
  };

  return (
    <ProtectedRoute allowedRoles={['Admin', 'HR']}>
      <div className="flex-1 flex flex-col h-full -mx-container-padding -my-container-padding bg-surface-container-lowest">
        {/* Top Header Bar */}
        <header className="flex justify-between items-center w-full px-container-padding h-16 shrink-0 bg-surface-container-lowest border-b border-surface-variant z-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-extrabold tracking-tighter text-on-surface">
              Nexus Talent
            </Link>
            <nav className="flex gap-4">
              <Link href="/hr/jobs" className="px-3 py-2 text-sm font-bold text-primary bg-primary/5 rounded-lg">Công việc</Link>
              <Link href="#" className="px-3 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">Ứng viên</Link>
              <Link href="#" className="px-3 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">Phỏng vấn</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                className="w-64 pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm font-body-sm focus:outline-none focus:border-primary transition-all" 
                placeholder="Tìm công việc..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
              {getInitials(user?.email || 'User')}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-container-padding">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-label-bold text-label-bold uppercase tracking-widest mb-1">
                <span className="material-symbols-outlined text-[14px]">dashboard</span>
                Trung tâm Tuyển dụng
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Danh sách Công việc</h1>
            </div>
            <Link href="/hr/jobs/create" className="px-6 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Tạo vị trí mới
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-surface-variant mb-8">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-4 text-sm font-bold transition-all relative ${
                  activeFilter === tab.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
                {activeFilter === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>

          {/* Job List Table/Cards */}
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job: Job) => (
                <div key={job.id} className="group bg-surface-container-low rounded-2xl p-6 border border-surface-variant/50 hover:border-primary/30 hover:shadow-ambient-card transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[28px]">work</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface group-hover:text-primary transition-colors">{job.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                          job.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 
                          job.status === 'PENDING' ? 'bg-blue-100 text-blue-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {job.status === 'ACTIVE' ? 'Hoạt động' : 
                           job.status === 'DRAFT' ? 'Bản nháp' : 
                           job.status === 'PENDING' ? 'Chờ duyệt' : 'Đã đóng'}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {job.company?.name} • {job.location?.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="text-center">
                      <div className="text-xl font-bold text-on-surface">
                        {job._count?.applications || 0}
                      </div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ứng viên</div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/hr/jobs/${job.id}/applicants`}
                        className="px-5 py-2.5 bg-surface-container-highest text-on-surface-variant font-label-bold text-label-bold rounded-lg hover:bg-primary hover:text-on-primary transition-all"
                      >
                        Ứng viên
                      </Link>
                      
                      {job.status === 'DRAFT' && (
                        <button 
                          onClick={() => handleRequestApproval(job.id)}
                          className="px-5 py-2.5 bg-primary/10 text-primary font-label-bold text-label-bold rounded-lg hover:bg-primary hover:text-on-primary transition-all"
                        >
                          Gửi duyệt
                        </button>
                      )}

                      {job.status === 'ACTIVE' && (
                        <button 
                          onClick={() => handleCloseJob(job.id)}
                          className="px-5 py-2.5 bg-error/10 text-error font-label-bold text-label-bold rounded-lg hover:bg-error hover:text-on-error transition-all"
                        >
                          Đóng
                        </button>
                      )}

                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
                <p className="text-on-surface-variant font-medium">Không tìm thấy công việc nào phù hợp.</p>
              </div>
            )}
          </div>
          
          {!loading && (
            <div className="mt-8 text-center">
              <p className="text-xs text-on-surface-variant">Hiển thị {jobs.length} công việc</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
