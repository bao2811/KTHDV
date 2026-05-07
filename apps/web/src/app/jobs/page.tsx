'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import JobCard from '@/components/features/jobs/JobCard';
import JobSearchFilters from '@/components/features/jobs/JobSearchFilters';
import JobDetailPreview from '@/components/features/jobs/JobDetailPreview';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Redirect if logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'Admin' || user.role === 'HR') {
        router.replace('/hr/jobs');
      } else {
        router.replace('/candidate/jobs');
      }
    }
  }, [user, authLoading, router]);

  const { 
    jobs, 
    loading, 
    pagination, 
    params, 
    updateFilters, 
    setPage 
  } = useJobs({ limit: 12 });

  // Auto select first job when loaded
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        
        {/* Search & Filters Section */}
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-on-surface tracking-tight mb-2">
            Tìm kiếm công việc mơ ước
          </h1>
          <div className="max-w-4xl">
            <JobSearchFilters onFilterChange={updateFilters} />
          </div>
        </section>

        {/* Master-Detail Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Master: List */}
          <section className={`flex flex-col gap-6 transition-all duration-500 ${
            selectedJob ? 'lg:col-span-7' : 'lg:col-span-12'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                Việc làm mới nhất
                {pagination.total > 0 && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md">
                    {pagination.total} vị trí
                  </span>
                )}
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-40 bg-surface-container rounded-2xl animate-pulse shadow-sm border border-surface-variant/30"></div>
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
                  <h3 className="text-xl font-bold text-on-surface mb-2">Không tìm thấy công việc</h3>
                  <p className="text-on-surface-variant">Thử điều chỉnh lại bộ lọc để có nhiều kết quả hơn.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      params.page === i + 1 
                        ? 'bg-primary text-on-primary shadow-md scale-110' 
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Detail: Preview Section */}
          {selectedJob && (
            <aside className="lg:col-span-5 sticky top-24 h-[calc(100vh-140px)] animate-in slide-in-from-right-4 duration-500">
              <JobDetailPreview 
                job={selectedJob} 
                onClose={() => setSelectedJob(null)} 
              />
            </aside>
          )}

        </div>
      </main>
    </div>
  );
}


