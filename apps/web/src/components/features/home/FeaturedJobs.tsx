"use client";

import { useJobs } from "@/hooks/useJobs";
import { Job } from "@/types";
import Link from "next/link";

export default function FeaturedJobs() {
  const { jobs, loading } = useJobs({ status: "ACTIVE", limit: 6 });

  if (loading) {
    return (
      <section className="py-24 bg-surface">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="h-8 w-64 bg-surface-container rounded-lg animate-pulse mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-surface-container rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">Cơ hội Nghề nghiệp Mới nhất</h2>
            <p className="text-lg text-on-surface-variant font-medium">Khám phá những vị trí lãnh đạo và chuyên gia đang được săn đón.</p>
          </div>
          <Link href="/jobs" className="font-bold text-primary flex items-center gap-2 hover:gap-4 transition-all group tracking-tight">
            Tất cả vị trí 
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job: Job) => (
            <Link 
              key={job.id} 
              href={`/jobs/${job.id}`}
              className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-variant/50 shadow-ambient-card hover:shadow-ambient-card-hover hover:border-primary/30 transition-all duration-500 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[32px]">business</span>
                  )}
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-primary/20">
                  {job.jobType?.replace('_', ' ') || "N/A"}
                </span>
              </div>

              <h4 className="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                {job.title}
              </h4>
              
              <div className="text-sm font-bold text-on-surface-variant mb-6">
                {job.company?.name || "Unknown Company"}
              </div>

              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-4 text-on-surface-variant">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {job.location?.name || "N/A"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    {job.salaryMin && job.salaryMax 
                      ? `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax / 1000000).toFixed(0)}tr`
                      : 'Thỏa thuận'}
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-variant/30 flex justify-between items-center">
                  <span className="text-[11px] font-medium text-outline">
                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Chi tiết
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
