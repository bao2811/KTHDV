'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockJobs = [
  {
    id: 'job-1',
    title: 'Kiến trúc sư Hệ thống Cao cấp',
    company: 'Giải pháp TechNova',
    location: 'Hà Nội, VN (Linh hoạt)',
    matchScore: 94,
    type: 'Toàn thời gian',
    salary: '60tr - 90tr VNĐ',
    tags: ['AWS', 'Microservices', 'Node.js'],
    icon: 'architecture'
  },
  {
    id: 'job-2',
    title: 'Kỹ sư DevOps Trưởng',
    company: 'CloudFirst VN',
    location: 'Từ xa',
    matchScore: 88,
    type: 'Toàn thời gian',
    salary: '50tr - 75tr VNĐ',
    tags: ['Kubernetes', 'CI/CD', 'Terraform'],
    icon: 'code_blocks'
  },
  {
    id: 'job-3',
    title: 'Nghiên cứu viên UX Cao cấp',
    company: 'Sáng tạo CreativeMinds',
    location: 'TP.HCM, VN',
    matchScore: 72,
    type: 'Hợp đồng',
    salary: '500.000đ/giờ',
    tags: ['User Testing', 'Data Analysis', 'Figma'],
    icon: 'design_services'
  },
  {
    id: 'job-4',
    title: 'Kỹ sư Frontend (React)',
    company: 'FinTech Global',
    location: 'Hà Nội, VN',
    matchScore: 91,
    type: 'Toàn thời gian',
    salary: '$2000 - $3500',
    tags: ['React', 'Next.js', 'TypeScript'],
    icon: 'laptop_mac'
  }
];

const categories = [
  { name: 'Kỹ thuật', count: 42 },
  { name: 'Thiết kế', count: 18 },
  { name: 'Sản phẩm', count: 24 },
  { name: 'Marketing', count: 12 }
];

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col lg:flex-row gap-grid-gutter w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-1/4 flex-shrink-0 flex flex-col gap-stack-gap-lg">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant/50 p-6 sticky top-24">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Bộ lọc</h2>
          
          <div className="flex flex-col gap-8">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="Tìm kiếm từ khóa..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-4 uppercase tracking-wider">Ngành nghề</h3>
              <div className="flex flex-col gap-3">
                {categories.map(cat => (
                  <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" />
                    <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">{cat.name} ({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Job Type Filter */}
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-4 uppercase tracking-wider">Hình thức</h3>
              <div className="flex flex-col gap-3">
                {['Toàn thời gian', 'Hợp đồng', 'Làm từ xa', 'Tự do'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" />
                    <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Filter */}
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-4 uppercase tracking-wider">Kỹ năng phổ biến</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'AWS', 'Figma', 'Python'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-surface-container text-on-surface-variant font-label-bold text-[11px] rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Card - Sidebar version
        <div className="bg-gradient-to-br from-primary to-indigo-900 rounded-2xl p-6 text-on-primary shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="font-headline-lg text-headline-lg font-bold mb-2">Nexus Talent AI</h4>
            <p className="text-xs opacity-80 mb-4">Nhận gợi ý việc làm chính xác tới 99% dựa trên hồ sơ của bạn.</p>
            <button className="w-full py-2 bg-white text-primary font-label-bold text-label-bold rounded-lg hover:shadow-xl transition-all active:scale-95">Tìm hiểu thêm</button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[100px] text-white/10 -rotate-12">auto_awesome</span>
        </div> */}
      </aside>

      {/* Job Listings Canvas */}
      <section className="flex-1 flex flex-col gap-stack-gap-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Tìm kiếm cơ hội mới</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Tìm thấy {mockJobs.length} vị trí phù hợp với tiêu chí của bạn.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-xl border border-surface-variant/30">
            <span className="font-label-bold text-label-bold text-on-surface-variant">Sắp xếp:</span>
            <select className="bg-transparent border-none font-label-bold text-label-bold text-primary focus:ring-0 cursor-pointer outline-none">
              <option>Phù hợp nhất</option>
              <option>Mới nhất</option>
              <option>Lương cao nhất</option>
            </select>
          </div>
        </div>

        {/* Job Cards List */}
        <div className="flex flex-col gap-4">
          {mockJobs.map((job) => (
            <div 
              key={job.id} 
              className="group bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant/50 flex flex-col md:flex-row gap-6 md:items-center hover:border-primary/50 hover:shadow-ambient-card transition-all duration-300 relative overflow-hidden"
            >
              {/* Highlight bar for high match */}
              {job.matchScore > 90 && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
              )}

              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-[32px]">{job.icon}</span>
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full font-label-bold text-[11px] uppercase tracking-wider ${
                      job.matchScore > 90 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container text-on-surface-variant border border-surface-variant/50'
                    }`}>
                      {job.matchScore}% Phù hợp
                    </span>
                    <button className="text-outline-variant hover:text-primary transition-all active:scale-75">
                      <span className="material-symbols-outlined text-[22px]">bookmark_border</span>
                    </button>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4 font-medium">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-lg font-label-bold text-[11px]">{job.type}</span>
                  <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant rounded-lg font-label-bold text-[11px]">{job.salary}</span>
                  {job.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-secondary-fixed/30 text-on-secondary-fixed-variant rounded-lg font-label-bold text-[11px]">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto md:min-w-[140px]">
                <button className="flex-1 px-6 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:shadow-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm">
                  Ứng tuyển ngay
                </button>
                <button className="flex-1 px-6 py-3 bg-surface-container-high text-on-surface-variant font-label-bold text-label-bold rounded-xl hover:bg-surface-variant transition-all active:scale-95">
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination/Load More */}
        <div className="mt-8 flex justify-center">
          <button className="group px-10 py-3 bg-surface-container-low border border-outline-variant/30 text-primary font-label-bold text-label-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center gap-2 shadow-sm">
            Xem thêm cơ hội
            <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">expand_more</span>
          </button>
        </div>
      </section>
    </div>
  );
}
