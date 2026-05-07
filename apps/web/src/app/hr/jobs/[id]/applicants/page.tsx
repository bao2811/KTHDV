'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockJob = {
  id: 'job-1',
  title: 'Kỹ sư Frontend Cao cấp',
  location: 'Hà Nội (Hybrid)',
  type: 'Toàn thời gian',
  stats: {
    total: 24,
  }
};

const mockApplicants = [
  { id: 'c-1', name: 'Nguyễn Thị Lan Anh', title: 'Trưởng nhóm Phát triển tại TechNova', initials: 'LA', score: 98, status: 'PHỎNG VẤN KỸ THUẬT', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAniwSa4bqbr7z5uI5If5O0NBXymHnPwIyXI8jgHjXTNaAgLAx69bc879flA4ycxsDZsGYMQ65N91KrZNT5MqiT0VRw6w5Fp57HK4IqZARjVr0xrQgwH1yR1wYzZYDO8mvNhaqmECqMEI79GaPXmVevOu2zcBpGtcqNdGJIl07HL0lOYPYf7Kmfu3qXErRzeTRZ-bX8tMMaKi5OIbXAZmGjcL8cViSEWAXF95gr3B_mthPiYCUlK0CD7wsUs9OXl7ZpLx24FZhtWQcn' },
  { id: 'c-2', name: 'Trần Minh Hoàng', title: 'Kỹ sư Frontend tại CloudSync', initials: 'MH', score: 85, status: 'SƠ VẤN QUA ĐIỆN THOẠI', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTXCYy4m6JYd2otuEXtFzw5BqKvPKdO2mdu9sCgiXW-GlVPIZ3VOo3nCb0B8qaDhb7_0eXh_UFzirtOFxaUJ1IfGRhFmFLRHbwRFUZ8SqB2cpShShEqYY53_SY0jSWSXotNqnN1f4RIH0jFpAFJgpHE_ZOf41LCN5SSMbA1e_YeGbrPvybXf5VqCj9HZS3DFijqwUSharffB6gx0Ys7RQnSZCX9XgmZ_Dh4FCrN2jH_Ipg97sIM0oaeA9yZ_1npedE4MsMKUvAMRza' },
  { id: 'c-3', name: 'Phạm Hồng Phúc', title: 'Lập trình viên UI tại CreativeMinds', initials: 'HP', score: 62, status: 'ĐÃ ỨNG TUYỂN', img: '' },
  { id: 'c-4', name: 'Lê Văn Nam', title: 'Kỹ sư Phần mềm tại InnoTech', initials: 'VN', score: null, status: 'ĐÃ GỬI', img: '' },
];

const getStatusBadge = (status: string) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-bold text-label-bold uppercase">
      {status}
    </span>
  );
};

export default function JobApplicantsList() {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [isMatching, setIsMatching] = useState(false);

  const handleRunMatch = (id: string) => {
    // Simulate matching for 1 applicant
    const btn = document.getElementById(`btn-match-${id}`);
    if (btn) btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px] mr-1">refresh</span> Đang so khớp...';
    
    setTimeout(() => {
      setApplicants(prev => prev.map(c => {
        if (c.id === id) {
          return { ...c, score: Math.floor(Math.random() * 40) + 60 }; // Random 60-100
        }
        return c;
      }));
    }, 1500);
  };

  const handleRunAll = () => {
    setIsMatching(true);
    setTimeout(() => {
      setApplicants(prev => prev.map(c => {
        if (c.score === null) {
          return { ...c, score: Math.floor(Math.random() * 40) + 60 };
        }
        return c;
      }));
      setIsMatching(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg">
      {/* Breadcrumb & Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
          <Link href="/hr/jobs" className="hover:text-primary transition-colors">Tin tuyển dụng</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-medium">Ứng viên</span>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/hr/pipeline" 
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-surface-variant rounded-lg font-label-bold text-label-bold text-on-surface hover:bg-surface-container-low transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">view_kanban</span>
            Xem quy trình
          </Link>
          <button 
            onClick={handleRunAll}
            disabled={isMatching}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-bold text-label-bold shadow-sm disabled:opacity-50 flex items-center"
          >
            {isMatching ? (
              <><span className="material-symbols-outlined animate-spin text-[18px] mr-2">refresh</span> Đang so khớp...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px] mr-2">psychology</span> So khớp tất cả</>
            )}
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-end pb-stack-gap-md border-b border-surface-variant">
        <div>
          <p className="font-label-bold text-label-bold text-primary mb-2 uppercase tracking-wider">Vị trí đang tuyển</p>
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">{mockJob.title}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">location_on</span> {mockJob.location}
            <span className="px-2 text-surface-variant">•</span>
            <span className="material-symbols-outlined text-sm">work</span> {mockJob.type}
          </p>
        </div>
        <div className="flex items-center gap-stack-gap-md">
          <div className="bg-surface-container-low px-4 py-2 rounded-lg border border-surface-variant flex items-center gap-2">
            <span className="font-label-bold text-label-bold text-on-surface-variant">Tổng số ứng viên</span>
            <span className="font-headline-lg text-headline-lg text-primary">{mockJob.stats.total}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-surface-variant rounded-lg font-label-bold text-label-bold text-on-surface hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Applicant List (Premium Bento/Card Style) */}
      <div className="flex flex-col gap-stack-gap-md">
        {applicants.map((candidate) => (
          <div key={candidate.id} className="bg-surface-container-lowest rounded-xl shadow-ambient p-stack-gap-md border border-surface-variant/50 hover:border-primary/30 transition-all duration-200 grid grid-cols-12 gap-grid-gutter items-center group">
            {/* Profile Info */}
            <div className="col-span-4 flex items-center gap-stack-gap-md">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-variant flex items-center justify-center text-on-surface-variant font-headline-lg text-headline-lg font-bold">
                {candidate.img ? (
                  <img alt={`${candidate.name} Profile`} className="w-full h-full object-cover" src={candidate.img} />
                ) : (
                  candidate.initials
                )}
              </div>
              <div>
                <h3 className="font-body-md text-body-md text-on-surface font-semibold">{candidate.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{candidate.title}</p>
              </div>
            </div>

            {/* Match Score */}
            <div className="col-span-3 flex flex-col gap-2">
              {candidate.score !== null ? (
                <>
                  <div className="flex justify-between items-end">
                    <span className="font-label-bold text-label-bold text-on-surface-variant uppercase">Điểm so khớp</span>
                    <span className="font-headline-lg text-headline-lg text-primary leading-none">{candidate.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${candidate.score}%` }}></div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-start h-full pt-2">
                  <button 
                    id={`btn-match-${candidate.id}`}
                    onClick={() => handleRunMatch(candidate.id)}
                    className="flex items-center gap-1 text-sm font-label-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    Chạy so khớp
                  </button>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="col-span-2 flex justify-center">
              {getStatusBadge(candidate.status)}
            </div>

            {/* Actions */}
            <div className="col-span-3 flex justify-end items-center gap-stack-gap-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Link 
                href={`/hr/candidates/${candidate.id}`}
                className="px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors font-label-bold text-label-bold flex items-center gap-1"
              >
                Hồ sơ
              </Link>
              {candidate.score === null ? (
                <button disabled className="px-4 py-2 rounded-lg bg-surface-variant text-on-surface-variant font-label-bold text-label-bold opacity-50 cursor-not-allowed border border-transparent">
                  Xem xét
                </button>
              ) : candidate.status === 'ĐÃ ỨNG TUYỂN' || candidate.status === 'ĐÃ GỬI' ? (
                <button className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors font-label-bold text-label-bold shadow-sm border border-surface-variant">
                  Xem xét
                </button>
              ) : candidate.status === 'SƠ VẤN QUA ĐIỆN THOẠI' ? (
                <button className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors font-label-bold text-label-bold shadow-sm border border-surface-variant">
                  Tiếp tục
                </button>
              ) : (
                <button className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-bold text-label-bold shadow-sm">
                  Mời việc
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
