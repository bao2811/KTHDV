'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockStats = {
  applied: 24,
  inReview: 8,
  interviews: 3,
};

const mockRecentApplications = [
  {
    id: 'app-1',
    jobTitle: 'Lập trình viên Frontend Cao cấp',
    companyName: 'TechFlow Systems',
    appliedAt: 'Đã ứng tuyển 2 ngày trước',
    status: 'Đang xem xét',
    statusIcon: 'hourglass_empty',
    icon: 'code'
  },
  {
    id: 'app-2',
    jobTitle: 'Nhà thiết kế UX/UI',
    companyName: 'Creative Catalyst',
    appliedAt: 'Đã ứng tuyển 1 tuần trước',
    status: 'Đang phỏng vấn',
    statusIcon: 'event',
    icon: 'design_services'
  },
  {
    id: 'app-3',
    jobTitle: 'Quản lý Sản phẩm',
    companyName: 'Innovate Inc.',
    appliedAt: 'Đã ứng tuyển 2 tuần trước',
    status: 'Đã ứng tuyển',
    statusIcon: 'check_circle',
    icon: 'architecture'
  },
];

const mockRecommendedJobs = [
  {
    id: 'job-1',
    jobTitle: 'Thiết kế Sản phẩm Trưởng',
    companyName: 'Nova Workspace Solutions',
    location: 'Từ xa',
    tags: ['Figma', 'Hệ thống thiết kế']
  },
  {
    id: 'job-2',
    jobTitle: 'Kỹ sư Frontend (React)',
    companyName: 'FinTech Global',
    location: 'New York, Mỹ',
    tags: ['React', 'TypeScript']
  }
];

export default function CandidateDashboard() {
  const [userName, setUserName] = useState<string>('Candidate');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.email) {
          setUserName(parsed.email.split('@')[0]);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <div className="flex flex-col gap-stack-gap-lg">
      {/* Header section */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">Trung tâm Nghề nghiệp</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Theo dõi tiến độ và khám phá những cơ hội mới.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-label-bold text-label-bold text-primary uppercase tracking-wider">Độ hoàn thiện hồ sơ</p>
          <div className="w-48 h-2 bg-surface-variant rounded-full mt-2 overflow-hidden">
            <div className="w-4/5 h-full bg-primary rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-12 gap-grid-gutter">
        {/* Stat Card 1 */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant flex items-start justify-between group hover:border-primary/50 transition-all cursor-pointer">
          <div>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Đã ứng tuyển</p>
            <p className="font-headline-xl text-headline-xl text-on-surface">{mockStats.applied}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant flex items-start justify-between group hover:border-primary/50 transition-all cursor-pointer">
          <div>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Đang xem xét</p>
            <p className="font-headline-xl text-headline-xl text-on-surface">{mockStats.inReview}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-variant flex items-start justify-between group hover:border-primary/50 transition-all cursor-pointer">
          <div>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Phỏng vấn</p>
            <p className="font-headline-xl text-headline-xl text-on-surface">{mockStats.interviews}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split 8 / 4 */}
      <div className="grid grid-cols-12 gap-grid-gutter mt-4">
        
        {/* Recent Applications (Left Side) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-gap-md">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Ứng tuyển gần đây</h3>
            <Link href="/candidate/applications" className="font-body-sm text-body-sm font-semibold text-primary hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
            {mockRecentApplications.map((app, index) => (
              <div key={app.id} className={`p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group ${index !== mockRecentApplications.length - 1 ? 'border-b border-surface-variant' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline">{app.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">{app.jobTitle}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{app.companyName} • {app.appliedAt}</p>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 font-label-bold text-label-bold ${
                  app.status === 'Đã ứng tuyển' ? 'bg-surface-variant text-on-surface-variant' : 'bg-primary/10 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">{app.statusIcon}</span>
                  {app.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended For You (Right Side) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-stack-gap-md">
          <h3 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            Gợi ý cho bạn
          </h3>
          
          <div className="flex flex-col gap-stack-gap-md">
            {mockRecommendedJobs.map((job, index) => (
              <div key={job.id} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-surface-variant hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden group">
                {index === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface pr-8 group-hover:text-primary transition-colors">{job.jobTitle}</h4>
                  <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">bookmark_border</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{job.companyName} • {job.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map(tag => (
                    <span key={tag} className="bg-surface-container px-2 py-1 rounded text-[11px] font-label-bold text-on-surface-variant">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/jobs/${job.id}`} className="block text-center w-full bg-primary/10 hover:bg-primary/20 text-primary font-label-bold text-label-bold py-2 rounded-lg transition-colors">
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
