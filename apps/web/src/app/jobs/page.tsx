'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React/Next.js)',
    company: { name: 'NexusTech', location: 'Hồ Chí Minh (Hybrid)', logo: 'code' },
    jobType: 'FULL_TIME',
    salaryMin: 20000000,
    salaryMax: 45000000,
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
    postedAt: '2 giờ trước',
    matchScore: 94,
  },
  {
    id: 'job-2',
    title: 'Backend Engineer (Node.js/NestJS)',
    company: { name: 'Global Solutions', location: 'Hà Nội (Remote)', logo: 'database' },
    jobType: 'REMOTE',
    salaryMin: 25000000,
    salaryMax: 50000000,
    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
    postedAt: '5 giờ trước',
    matchScore: 88,
  },
  {
    id: 'job-3',
    title: 'UI/UX Product Designer',
    company: { name: 'Creative Minds', location: 'Hồ Chí Minh', logo: 'design_services' },
    jobType: 'FULL_TIME',
    salaryMin: 15000000,
    salaryMax: 30000000,
    skills: ['Figma', 'Prototyping', 'User Research'],
    postedAt: '1 ngày trước',
    matchScore: 72,
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer (AWS/Kubernetes)',
    company: { name: 'Cloudify', location: 'Đà Nẵng', logo: 'cloud' },
    jobType: 'FULL_TIME',
    salaryMin: 30000000,
    salaryMax: 60000000,
    skills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    postedAt: '2 ngày trước',
    matchScore: 85,
  }
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (!isClient) return null;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      {/* TopNavBar (Shared Component) */}
      <nav className="bg-surface-container-lowest shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-container-padding py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-stack-gap-lg">
            <Link href="/" className="text-headline-lg font-headline-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined icon-fill">token</span>
              NexusTalent
            </Link>
            <div className="hidden md:flex gap-stack-gap-md ml-8">
              <Link href="/jobs" className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1 hover:text-primary transition-all active:scale-95 duration-200">
                Tìm việc làm
              </Link>
              <Link href="/candidate/dashboard" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-all active:scale-95 duration-200">
                Trang cá nhân ứng viên
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-stack-gap-md">
            <Link href="/login" className="font-body-md text-body-md text-primary bg-transparent px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors active:scale-95 duration-200">
              Đăng nhập
            </Link>
            <Link href="/register" className="font-body-md text-body-md text-on-primary bg-primary px-4 py-2 rounded-xl shadow-sm hover:bg-secondary transition-colors active:scale-95 duration-200">
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-container-padding py-stack-gap-lg gap-grid-gutter mt-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4 flex-shrink-0 bg-surface-container-lowest rounded-2xl shadow-ambient-card p-stack-gap-lg h-fit sticky top-24">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-gap-lg">Bộ lọc</h2>
          
          <div className="flex flex-col gap-stack-gap-lg">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-full text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container focus:ring-opacity-50 transition-shadow" 
                placeholder="Tìm từ khóa..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-stack-gap-sm uppercase tracking-wider">Ngành nghề</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">IT - Phần mềm (42)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Thiết kế - UX/UI (18)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Marketing (24)</span>
                </label>
              </div>
            </div>

            <hr className="border-outline-variant/30"/>

            {/* Job Type Filter */}
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-stack-gap-sm uppercase tracking-wider">Loại hình</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Toàn thời gian</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Bán thời gian</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox h-5 w-5 text-primary border-outline-variant rounded focus:ring-primary focus:ring-offset-surface-container-lowest" type="checkbox"/>
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Làm từ xa (Remote)</span>
                </label>
              </div>
            </div>

            <hr className="border-outline-variant/30"/>

            {/* Skills Filter */}
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface-variant mb-stack-gap-sm uppercase tracking-wider">Kỹ năng</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary-container/20 text-primary font-body-sm text-body-sm rounded-full cursor-pointer hover:bg-primary-container/30 transition-colors">React</span>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-body-sm text-body-sm rounded-full cursor-pointer hover:bg-surface-variant transition-colors">Python</span>
                <span className="px-3 py-1 bg-primary-container/20 text-primary font-body-sm text-body-sm rounded-full cursor-pointer hover:bg-primary-container/30 transition-colors">AWS</span>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-body-sm text-body-sm rounded-full cursor-pointer hover:bg-surface-variant transition-colors">Figma</span>
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant font-body-sm text-body-sm rounded-full cursor-pointer hover:bg-surface-variant transition-colors">Docker</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Job Listings Canvas */}
        <section className="w-full lg:w-3/4 flex flex-col gap-stack-gap-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-background mb-2">Khám phá cơ hội nghề nghiệp.</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Hiển thị {MOCK_JOBS.length} công việc phù hợp với tiêu chí của bạn.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Sắp xếp theo:</span>
              <select className="bg-surface-container-lowest border-none font-body-md text-body-md text-primary font-semibold focus:ring-0 cursor-pointer outline-none">
                <option>Phù hợp nhất</option>
                <option>Mới nhất</option>
                <option>Lương (Cao đến Thấp)</option>
              </select>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="flex flex-col gap-stack-gap-md">
            {MOCK_JOBS.map((job) => (
              <div key={job.id} className="bg-surface-container-lowest rounded-2xl p-stack-gap-lg shadow-ambient-card flex flex-col md:flex-row gap-stack-gap-md md:items-center hover:-translate-y-1 transition-transform duration-300 border border-transparent hover:border-primary-fixed">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined icon-fill text-[32px]">{job.company.logo}</span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-headline-lg text-headline-lg text-on-surface line-clamp-1">{job.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-3 py-1 rounded-full font-label-bold text-label-bold ${
                        job.matchScore >= 85 ? 'bg-primary-container/20 text-primary' : 'bg-surface-variant text-on-surface-variant'
                      }`}>
                        {job.matchScore}% Phù hợp
                      </span>
                      <button className="text-outline-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">bookmark_border</span>
                      </button>
                    </div>
                  </div>
                  
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    {job.company.name} &bull; {job.company.location}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded font-body-sm text-body-sm">{job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'REMOTE' ? 'Làm từ xa' : 'Hợp đồng'}</span>
                    <span className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded font-body-sm text-body-sm">{formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}</span>
                    {job.skills.slice(0, 3).map(skill => (
                       <span key={skill} className="px-2 py-1 bg-surface-variant text-on-surface-variant rounded font-body-sm text-body-sm">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 mt-4 md:mt-0 flex md:flex-col gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none font-body-md text-body-md text-on-primary bg-primary px-6 py-3 rounded-xl hover:bg-secondary transition-colors shadow-sm text-center">
                    Ứng tuyển ngay
                  </button>
                  <Link href={`/jobs/${job.id}`} className="flex-1 md:flex-none font-body-md text-body-md text-primary bg-surface-container-low px-6 py-3 rounded-xl hover:bg-primary-container/30 transition-colors text-center">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 flex justify-center">
            <button className="font-body-md text-body-md text-primary border border-primary-container px-8 py-3 rounded-xl hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2">
              Tải thêm công việc
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

