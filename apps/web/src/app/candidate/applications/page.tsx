'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockApplications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Kỹ sư Frontend Cao cấp',
    companyName: 'Tập đoàn TechCorp',
    location: 'Hà Nội, VN (Linh hoạt)',
    companyLogo: 'https://ui-avatars.com/api/?name=TechCorp&background=6063ee&color=fff',
    appliedAt: '24 Thg 10, 2025',
    status: 'Đang phỏng vấn',
    statusColor: 'bg-blue-100 text-blue-700',
    steps: [
      { id: 'applied', label: 'Đã ứng tuyển', state: 'completed' },
      { id: 'screen', label: 'Sơ vấn', state: 'completed' },
      { id: 'interview', label: 'Phỏng vấn', state: 'completed' },
      { id: 'offer', label: 'Nhận việc', state: 'current' },
    ],
    progress: 75
  },
  {
    id: 'app-2',
    jobId: 'job-2',
    jobTitle: 'Nhà thiết kế UX',
    companyName: 'Hệ thống Innova',
    location: 'Đà Nẵng, VN',
    companyLogo: 'https://ui-avatars.com/api/?name=InnovaSystems&background=10b981&color=fff',
    appliedAt: '02 Thg 11, 2025',
    status: 'Đang sơ vấn',
    statusColor: 'bg-green-100 text-green-700',
    steps: [
      { id: 'applied', label: 'Đã ứng tuyển', state: 'completed' },
      { id: 'screen', label: 'Sơ vấn', state: 'current' },
      { id: 'interview', label: 'Phỏng vấn', state: 'pending' },
      { id: 'offer', label: 'Nhận việc', state: 'pending' },
    ],
    progress: 25
  },
  {
    id: 'app-3',
    jobId: 'job-3',
    jobTitle: 'Lập trình viên Backend',
    companyName: 'Giải pháp Toàn cầu',
    location: 'TP.HCM, VN',
    companyLogo: 'https://ui-avatars.com/api/?name=GlobalSolutions&background=f59e0b&color=fff',
    appliedAt: '15 Thg 11, 2025',
    status: 'Đã ứng tuyển',
    statusColor: 'bg-gray-100 text-gray-700',
    steps: [
      { id: 'applied', label: 'Đã ứng tuyển', state: 'current' },
      { id: 'screen', label: 'Sơ vấn', state: 'pending' },
      { id: 'interview', label: 'Phỏng vấn', state: 'pending' },
      { id: 'offer', label: 'Nhận việc', state: 'pending' },
    ],
    progress: 0
  }
];

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả', count: 12 },
  { id: 'ACTIVE', label: 'Đang xử lý', count: 4 },
  { id: 'INTERVIEWING', label: 'Phỏng vấn', count: 2 },
  { id: 'OFFERED', label: 'Lời mời', count: 1 },
];

export default function CandidateApplications() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  return (
    <div className="p-container-padding max-w-7xl mx-auto w-full space-y-stack-gap-lg">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">Đơn ứng tuyển</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Theo dõi lộ trình sự nghiệp và các cơ hội bạn đang theo đuổi.</p>
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2 rounded-xl font-label-bold text-label-bold flex-shrink-0 transition-all duration-300 ${
                activeFilter === tab.id
                  ? 'bg-primary text-on-primary shadow-md transform scale-105'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              {tab.label} <span className={`ml-1 opacity-60 ${activeFilter === tab.id ? 'text-on-primary' : ''}`}>({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {mockApplications.map((app) => (
          <div 
            key={app.id} 
            className="group bg-surface-container-lowest backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:shadow-ambient-card border border-surface-variant/50 hover:border-primary/30 relative overflow-hidden"
          >
            {/* Status Decoration */}
            <div className={`absolute left-0 top-0 w-1.5 h-full ${
              app.status === 'Đang phỏng vấn' ? 'bg-blue-500' : 
              app.status === 'Đang sơ vấn' ? 'bg-green-500' : 'bg-primary'
            }`}></div>

            <div className="flex flex-col xl:flex-row justify-between gap-8">
              
              {/* Job Info */}
              <div className="flex items-start gap-5 flex-1">
                <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 overflow-hidden border border-surface-variant/50 shadow-sm transition-transform group-hover:scale-105">
                  <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">{app.jobTitle}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant font-medium">{app.companyName} • {app.location}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-outline font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      Ngày ứng tuyển: {app.appliedAt}
                    </div>
                    <button className="text-primary font-label-bold text-label-bold hover:underline flex items-center gap-1">
                      Xem việc làm <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="w-full xl:w-1/2 flex flex-col justify-center">
                <div className="mb-6 flex justify-between items-end">
                  <span className="text-on-surface font-label-bold text-label-bold">Tiến độ ứng tuyển</span>
                  <span className="text-primary font-label-bold text-label-bold">{app.progress}%</span>
                </div>
                
                <div className="flex justify-between relative px-2">
                  {/* Track Background */}
                  <div className="absolute left-0 top-[12px] w-full h-1 bg-surface-container-high -translate-y-1/2 rounded-full"></div>
                  {/* Track Active */}
                  <div 
                    className="absolute left-0 top-[12px] h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(70,72,212,0.4)]"
                    style={{ width: `${app.progress}%` }}
                  ></div>
                  
                  {app.steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                        step.state === 'completed' 
                          ? 'bg-primary text-on-primary scale-110' 
                          : step.state === 'current'
                            ? 'bg-surface border-2 border-primary text-primary animate-pulse'
                            : 'bg-surface-container-high text-outline-variant'
                      }`}>
                        {step.state === 'completed' ? (
                          <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${step.state === 'current' ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                        )}
                      </div>
                      
                      <span className={`font-label-bold text-[11px] uppercase tracking-wide transition-colors ${
                        step.state === 'completed' || step.state === 'current' ? 'text-on-surface' : 'text-outline-variant'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center">
                <button className="w-full xl:w-auto px-6 py-2.5 bg-surface-container-high text-on-surface-variant font-label-bold text-label-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center justify-center gap-2">
                  Chi tiết
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State Mock */}
      {mockApplications.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/50">
          <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[48px] text-outline opacity-40">work_history</span>
          </div>
          <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Bạn chưa ứng tuyển vị trí nào</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-center max-w-sm">
            Khám phá hàng ngàn cơ hội việc làm phù hợp với năng lực của bạn ngay hôm nay.
          </p>
          <Link href="/jobs" className="mt-8 px-8 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:shadow-lg transition-all active:scale-95">
            Tìm việc ngay
          </Link>
        </div>
      )}

    </div>
  );
}

