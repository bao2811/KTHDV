'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useJobs } from '@/hooks/useJobs';
import JobCard from '@/components/features/jobs/JobCard';
import JobSearchFilters from '@/components/features/jobs/JobSearchFilters';
import JobDetailPreview from '@/components/features/jobs/JobDetailPreview';

export default function CandidateJobs() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { 
    jobs, 
    loading, 
    pagination, 
    params, 
    updateFilters, 
    setPage 
  } = useJobs({ limit: 10 });

  // Reset selected job when filters change or jobs reload
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
        
        {/* Header & Search Section - Full Width Background */}
        <div className="bg-surface-container-lowest border-b border-outline-variant/20 -mx-6 -mt-6 mb-6">
          <JobSearchFilters onFilterChange={updateFilters} />
        </div>

        {/* Master-Detail Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-grow overflow-hidden">
          
          {/* Advanced Filters Sidebar (TopCV Style) */}
          <aside className="lg:col-span-2 hidden xl:flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <div>
              <h4 className="text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Lọc nâng cao
              </h4>
              
              <div className="flex flex-col gap-6">
                {/* Exp Filter */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-on-surface">Kinh nghiệm</span>
                  {['Tất cả', 'Chưa có kinh nghiệm', 'Dưới 1 năm', '1 - 3 năm', '3 - 5 năm', 'Trên 5 năm'].map(exp => (
                    <label key={exp} className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 rounded-sm bg-primary opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-xs text-on-surface-variant group-hover:text-primary transition-colors">{exp}</span>
                    </label>
                  ))}
                </div>

                {/* Level Filter */}
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-on-surface">Cấp bậc</span>
                  {['Nhân viên', 'Trưởng phòng', 'Giám đốc', 'Thực tập sinh'].map(lvl => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer group">
                      <div className="w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 rounded-sm bg-primary opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-xs text-on-surface-variant group-hover:text-primary transition-colors">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Master: List */}
          <section className={`flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 transition-all duration-500 ${
            selectedJob ? 'lg:col-span-5 xl:col-span-5' : 'lg:col-span-12 xl:col-span-10'
          }`} style={{ maxHeight: 'calc(100vh - 220px)' }}>
            
            <div className="flex justify-between items-center px-1 sticky top-0 bg-surface-container-lowest/80 backdrop-blur-md py-2 z-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface">Ưu tiên hiển thị:</span>
                <div className="flex bg-surface-container rounded-lg p-0.5">
                  <button className="px-3 py-1 text-[10px] font-bold bg-white shadow-sm rounded-md text-primary">Tin mới nhất</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-on-surface-variant hover:text-on-surface">Lương cao nhất</button>
                </div>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Cập nhật 1 phút trước</span>
            </div>

            <div className="flex flex-col gap-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-surface-container rounded-2xl animate-pulse border border-surface-variant/30 shadow-sm"></div>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  />
                ))
              ) : (
                <div className="bg-surface-container-lowest rounded-2xl p-20 text-center border border-dashed border-outline-variant/50">
                  <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">search_off</span>
                  <h3 className="text-xl font-bold text-on-surface">Không tìm thấy công việc</h3>
                  <p className="text-on-surface-variant mt-2">Thử điều chỉnh lại bộ lọc để có nhiều kết quả hơn.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination?.totalPages && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 mb-4">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      params.page === i + 1 
                        ? 'bg-primary text-on-primary shadow-md scale-110' 
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-variant border border-surface-variant/30'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Detail: Preview */}
          {selectedJob && (
            <aside className="lg:col-span-5 sticky top-0 h-full max-h-[calc(100vh-300px)] animate-in slide-in-from-right-4 duration-500">
              <JobDetailPreview 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)} 
              />
            </aside>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
