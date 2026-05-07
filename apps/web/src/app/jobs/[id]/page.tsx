'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { jobService } from '@/services/job.service';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-24 p-8 max-w-7xl mx-auto flex flex-col gap-8 animate-pulse">
          <div className="h-40 bg-surface-container rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-surface-container rounded-2xl"></div>
            <div className="h-64 bg-surface-container rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-20 text-center">
          <h2 className="text-2xl font-bold text-on-surface">Không tìm thấy công việc</h2>
          <button onClick={() => router.push('/jobs')} className="mt-4 text-primary font-bold">Quay lại danh sách</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 px-container-padding max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        {/* Back Link */}
        <button 
          onClick={() => router.push('/jobs')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-label-bold text-label-bold uppercase">Quay lại tìm việc</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-grow lg:w-2/3 space-y-8">
            {/* Job Header Card */}
            <section className="bg-surface-container-lowest rounded-3xl border border-surface-variant/30 shadow-sm p-10 space-y-8 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <h1 className="font-headline-xl text-3xl font-black text-on-surface leading-tight">{job.title}</h1>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className="font-bold text-primary text-lg">{job.company?.name}</span>
                    <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span className="font-medium">{job.location?.city}</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-surface-container-low rounded-2xl flex items-center justify-center shrink-0 border border-surface-variant/30 shadow-sm">
                  {job.company?.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="material-symbols-outlined text-[40px] text-primary">domain</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-sm border border-primary/10">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  {job.jobType}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-success/5 text-success rounded-xl font-bold text-sm border border-success/10">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  {job.salaryMin ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : 'Thỏa thuận'}
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section className="bg-surface-container-lowest rounded-3xl border border-surface-variant/30 shadow-sm p-10">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Chi tiết công việc
              </h2>
              <div className="text-on-surface-variant leading-relaxed whitespace-pre-line text-base">
                {job.description}
              </div>
            </section>

            {/* Skills Section */}
            <section className="bg-surface-container-lowest rounded-3xl border border-surface-variant/30 shadow-sm p-10">
              <h2 className="text-xl font-black text-on-surface mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                Kỹ năng yêu cầu
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.jobSkills?.map((js: any) => (
                  <span 
                    key={js.skillId} 
                    className="px-5 py-2.5 bg-surface-container text-on-surface-variant rounded-xl text-sm font-bold border border-surface-variant/30 hover:border-primary hover:text-primary transition-all cursor-default"
                  >
                    {js.skill?.name}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Apply Action Card */}
            <div className="bg-primary text-on-primary rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               
               <h3 className="text-2xl font-black mb-3 text-on-primary relative z-10">Gia nhập TechNova</h3>
               <p className="text-on-primary/80 mb-10 relative z-10 font-medium">Chúng tôi đang tìm kiếm những tài năng như bạn để cùng xây dựng tương lai.</p>
               
               {user ? (
                 <button 
                   onClick={() => router.push(`/jobs/${job.id}/apply`)}
                   className="w-full bg-white text-primary font-black py-4 rounded-2xl shadow-lg hover:bg-surface-container transition-all active:scale-[0.98] relative z-10 uppercase tracking-widest text-sm"
                 >
                   ỨNG TUYỂN NGAY
                 </button>
               ) : (
                 <button 
                   onClick={() => router.push('/login')}
                   className="w-full bg-white text-primary font-black py-4 rounded-2xl shadow-lg hover:bg-surface-container transition-all active:scale-[0.98] relative z-10 uppercase tracking-widest text-sm"
                 >
                   ĐĂNG NHẬP ĐỂ ỨNG TUYỂN
                 </button>
               )}
            </div>

            {/* Quick Facts Sidebar */}
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant/30 shadow-sm p-8 space-y-6">
              <h3 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-2">Thông tin bổ sung</h3>
              {[
                { icon: 'location_on', label: 'Địa điểm', value: job.location?.city },
                { icon: 'history', label: 'Ngày đăng', value: 'Mới cập nhật' },
                { icon: 'groups', label: 'Quy mô công ty', value: '100-500 nhân viên' },
              ].map((fact, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">{fact.icon}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-outline uppercase tracking-widest mb-0.5">{fact.label}</div>
                    <div className="text-sm font-bold text-on-surface">{fact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
