'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import { jobService } from '@/services/job.service';
import { Job } from '@/types';
import { JOB_STATUS_LABELS, JOB_TYPE_LABELS } from '@/constants';

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'ACTIVE', label: 'Đang hoạt động' },
  { id: 'PENDING', label: 'Chờ duyệt' },
  { id: 'DRAFT', label: 'Bản nháp' },
  { id: 'CLOSED', label: 'Đã đóng' },
];

export default function JobManagement() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { jobs, loading, error, updateFilters, pagination } = useJobs({
    status: activeFilter === 'ALL' ? undefined : activeFilter,
    search: searchQuery || undefined,
  });

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    updateFilters({ status: filterId === 'ALL' ? undefined : filterId });
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await jobService.deleteJob(id);
      updateFilters({}); // refresh
      setDeleteConfirm(null);
    } catch (err) {
      alert('Xóa thất bại. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-bold text-label-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">work</span>
            Trung tâm Tuyển dụng
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Danh sách Công việc</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              className="w-64 pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm font-body-sm focus:outline-none focus:border-primary transition-all"
              placeholder="Tìm công việc..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateFilters({ search: e.target.value || undefined });
              }}
            />
          </div>
          <Link
            href="/hr/jobs/create"
            className="px-6 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Tạo vị trí mới
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-surface-variant">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
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

      {/* Job List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job: Job) => (
            <div key={job.id} className="group bg-surface-container-lowest rounded-2xl p-6 border border-surface-variant/50 hover:border-primary/30 hover:shadow-ambient-card transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[28px]">work</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <Link href={`/hr/jobs/${job.id}`}>
                      <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface group-hover:text-primary transition-colors truncate">{job.title}</h3>
                    </Link>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      job.status === 'DRAFT' ? 'bg-surface-container-highest text-on-surface-variant' :
                      job.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {JOB_STATUS_LABELS[job.status] || job.status}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {job.company?.name || 'N/A'} • {job.location?.city || 'N/A'}
                    {job.jobType && ` • ${JOB_TYPE_LABELS[job.jobType] || job.jobType}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-8 shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold text-on-surface">
                    {job._count?.applications || 0}
                  </div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ứng viên</div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/hr/jobs/${job.id}`}
                    className="px-4 py-2.5 bg-surface-container-highest text-on-surface-variant font-label-bold text-label-bold rounded-lg hover:bg-primary hover:text-on-primary transition-all"
                  >
                    Chi tiết
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(job.id)}
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
        <div className="mt-4 text-center">
          <p className="text-xs text-on-surface-variant">
            Hiển thị {jobs.length} / {pagination?.total || jobs.length} công việc
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface">Xóa tin tuyển dụng?</h2>
            </div>
            <p className="text-on-surface-variant text-sm mb-6">Hành động này không thể hoàn tác. Tin tuyển dụng sẽ bị xóa vĩnh viễn.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-outline-variant text-on-surface font-label-bold rounded-lg hover:bg-surface-variant transition-colors">
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 bg-error text-on-error font-label-bold rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span>}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
