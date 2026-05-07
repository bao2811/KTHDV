'use client';

import Link from 'next/link';
import { Job } from '@/types';

interface JobCardProps {
  job: any;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'Toàn thời gian';
      case 'PART_TIME': return 'Bán thời gian';
      case 'REMOTE': return 'Làm từ xa';
      default: return type;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-5 shadow-sm border transition-all duration-300 group cursor-pointer relative overflow-hidden ${
        isSelected 
          ? 'border-primary shadow-lg ring-1 ring-primary/20 bg-primary/[0.01]' 
          : 'border-surface-variant/30 hover:border-primary/40 hover:shadow-ambient-card'
      }`}
    >
      {/* Selected Indicator Bar */}
      {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-in fade-in duration-500"></div>}

      <div className="flex flex-col md:flex-row gap-5">
        {/* Company Logo - Clean & Bordered */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-white border border-surface-variant/20 rounded-xl flex items-center justify-center p-2 group-hover:shadow-sm transition-all duration-300">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
            ) : (
              <span className="material-symbols-outlined text-primary/40 text-3xl">corporate_fare</span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow flex flex-col justify-between min-w-0 gap-3">
          <div className="flex flex-col md:flex-row justify-between items-start gap-2">
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                {job.company?.name}
              </p>
            </div>
            {/* Salary - Prominent Green like TopCV */}
            <div className="text-success font-black text-base whitespace-nowrap md:text-right">
              {job.salaryMin ? `${formatCurrency(job.salaryMin)}` : 'Thỏa thuận'}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded-md border border-surface-variant/20">
              <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
              {job.location?.city || 'Toàn quốc'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded-md border border-surface-variant/20">
              <span className="material-symbols-outlined text-[16px] text-outline">work_history</span>
              {job.experienceLevel || '1-3 năm'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded-md border border-surface-variant/20">
              <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
              {getJobTypeLabel(job.jobType)}
            </div>
            
            {/* Minimal Skill Badges */}
            <div className="flex gap-1.5 ml-auto">
               {job.jobSkills?.slice(0, 3).map((js: any) => (
                 <span key={js.skillId} className="text-[10px] font-black text-primary/60 uppercase tracking-tighter opacity-70">
                   #{js.skill?.name}
                 </span>
               ))}
            </div>
          </div>
        </div>

        {/* Action / Bookmark Overlay on Hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="w-9 h-9 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
