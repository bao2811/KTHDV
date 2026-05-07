'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { jobService } from '@/services/job.service';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobById(id as string);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col gap-8 animate-pulse">
        <div className="h-8 w-48 bg-surface-container rounded-lg"></div>
        <div className="h-40 bg-surface-container rounded-2xl"></div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-96 bg-surface-container rounded-2xl"></div>
          <div className="h-64 bg-surface-container rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-on-surface">Không tìm thấy công việc</h2>
        <button onClick={() => router.back()} className="mt-4 text-primary font-bold">Quay lại</button>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <div className="p-container-padding max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-label-bold text-label-bold uppercase">Quay lại danh sách</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-stack-gap-lg">
          {/* Main Content Area */}
          <div className="flex-grow lg:w-2/3 space-y-stack-gap-lg">
            {/* Job Header Card */}
            <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface leading-tight">{job.title}</h1>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="font-body-md text-body-md font-bold text-primary">{job.company?.name}</span>
                    <span>•</span>
                    <span className="font-body-md text-body-md">{job.location?.city}</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-surface-variant/50 shadow-sm">
                  {job.company?.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="material-symbols-outlined text-[32px] text-primary">domain</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="bg-primary/10 text-primary font-label-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-primary/20">
                  {job.jobType}
                </span>
                <span className="bg-surface-container text-on-surface-variant font-label-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-surface-variant/50">
                  {job.salaryMin ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : 'Thỏa thuận'}
                </span>
              </div>
            </section>

            {/* Job Description Card */}
            <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card overflow-hidden">
              <div className="px-8 py-4 border-b border-surface-variant/50 bg-surface-container-low">
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mô tả công việc</h2>
              </div>
              <div className="p-8 space-y-4 font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </section>

            {/* Skills Section */}
            <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card overflow-hidden">
              <div className="px-8 py-4 border-b border-surface-variant/50 bg-surface-container-low flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface tracking-wider">Kỹ năng yêu cầu</h3>
              </div>
              <div className="p-6 flex flex-wrap gap-2">
                {job.jobSkills?.map((js: any) => (
                  <span 
                    key={js.skillId} 
                    className="bg-surface-container text-on-surface-variant font-label-bold text-[12px] px-4 py-2 rounded-xl border border-surface-variant/50"
                  >
                    {js.skill?.name}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:w-1/3 flex flex-col gap-stack-gap-lg">
            {/* Apply Action Card */}
            <div className="bg-primary text-on-primary rounded-2xl shadow-xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
              
              <h3 className="font-headline-lg text-headline-lg font-bold mb-2 text-on-primary relative z-10">Sẵn sàng ứng tuyển?</h3>
              <p className="font-body-md text-body-md text-on-primary/80 mb-8 relative z-10">Gia nhập đội ngũ của chúng tôi ngay hôm nay.</p>
              
              <button 
                className="w-full bg-surface text-primary font-label-bold text-label-bold py-4 rounded-xl shadow-md hover:bg-surface-container-high transition-all active:scale-[0.98] relative z-10 uppercase tracking-widest"
              >
                ỨNG TUYỂN NGAY
              </button>
              
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="mt-4 w-full bg-transparent text-on-primary font-label-bold text-label-bold py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 relative z-10"
              >
                <span className={`material-symbols-outlined text-[20px] ${isSaved ? 'font-variation-fill' : ''}`}>
                  {isSaved ? 'bookmark_added' : 'bookmark'}
                </span> 
                {isSaved ? 'Đã lưu' : 'Lưu tin này'}
              </button>
            </div>

            {/* Quick Facts */}
            <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-variant/50 bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface tracking-wider">Thông tin nhanh</h3>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { icon: 'calendar_today', label: 'Địa điểm', value: job.location?.city },
                  { icon: 'work', label: 'Loại công việc', value: job.jobType },
                  { icon: 'payments', label: 'Mức lương', value: job.salaryMin ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : 'Thỏa thuận' },
                ].map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-outline text-[20px]">{fact.icon}</span>
                    </div>
                    <div>
                      <div className="font-label-bold text-[10px] text-outline uppercase tracking-wider mb-0.5">{fact.label}</div>
                      <div className="font-body-md text-body-md text-on-surface font-semibold">{fact.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ProtectedRoute>
  );
}
