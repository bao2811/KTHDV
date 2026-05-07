'use client';

import { Job } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface JobDetailPreviewProps {
  job: any;
  onClose?: () => void;
}

export default function JobDetailPreview({ job, onClose }: JobDetailPreviewProps) {
  const { user } = useAuth();
  
  if (!job) return null;

  const isCandidate = user?.role === 'Candidate' || (typeof user?.role === 'object' && user?.role?.name === 'Candidate');
  const detailHref = isCandidate ? `/candidate/jobs/${job.id}` : `/jobs/${job.id}`;
  const applyHref = isCandidate ? `/candidate/jobs/${job.id}/apply` : `/jobs/${job.id}/apply`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-lg border border-surface-variant/50 h-full flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Header with Close Button */}
      <div className="p-4 border-b border-surface-variant/30 flex justify-between items-center bg-surface-container-low/50">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Xem trước công việc</span>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="flex-grow overflow-auto p-6 flex flex-col gap-8 custom-scrollbar">
        {/* Basic Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center border border-surface-variant/30 shrink-0">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
              ) : (
                <span className="material-symbols-outlined text-primary text-3xl">corporate_fare</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface leading-tight mb-1">{job.title}</h2>
              <p className="text-primary font-medium hover:underline cursor-pointer">{job.company?.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
             <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {job.location?.city || 'Toàn quốc'}
             </div>
             <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                {job.jobType}
             </div>
             <div className="flex items-center gap-2 text-success font-bold text-sm">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                {job.salaryMin ? `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}` : 'Thỏa thuận'}
             </div>
          </div>
        </div>

        <hr className="border-surface-variant/30" />

        {/* Requirements & Description */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">description</span>
              Mô tả công việc
            </h3>
            <div className="text-sm text-on-surface-variant leading-relaxed line-clamp-6">
              {job.description}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
              Kỹ năng yêu cầu
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.jobSkills?.map((js: any) => (
                <span key={js.skillId} className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold border border-outline-variant/30">
                  {js.skill?.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Placeholder */}
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
           <h4 className="text-xs font-bold text-primary uppercase mb-2">Quyền lợi hấp dẫn</h4>
           <ul className="text-[13px] text-on-surface-variant flex flex-col gap-1.5">
             <li className="flex items-start gap-2">
               <span className="text-primary">•</span>
               Thưởng tháng lương thứ 13 và các dịp lễ tết.
             </li>
             <li className="flex items-start gap-2">
               <span className="text-primary">•</span>
               Bảo hiểm sức khỏe cao cấp cho nhân viên.
             </li>
             <li className="flex items-start gap-2">
               <span className="text-primary">•</span>
               Môi trường làm việc trẻ trung, năng động.
             </li>
           </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-surface-variant/30 bg-surface-container-lowest flex gap-3">
        <Link 
          href={applyHref}
          className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold text-center hover:bg-primary-fixed-variant transition-all shadow-sm"
        >
          Ứng tuyển ngay
        </Link>
        <Link 
          href={detailHref}
          className="flex-1 py-3 bg-surface-container text-on-surface-variant rounded-xl font-bold text-center hover:bg-surface-variant transition-all border border-outline-variant/30"
        >
          Chi tiết
        </Link>
      </div>
    </div>
  );
}
