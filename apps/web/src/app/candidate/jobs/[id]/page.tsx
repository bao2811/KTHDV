'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// --- MOCK DATA ---
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Architect',
    company: 'TechNova Solutions Inc.',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-Time',
    level: 'Senior Level',
    salary: '$140k - $180k',
    postedAt: '2 days ago',
    description: `We are seeking a visionary Senior Frontend Architect to lead the modernization of our core enterprise platforms. You will be responsible for defining the technical strategy, establishing best practices, and mentoring a team of highly skilled engineers.\n\nThis role demands a deep understanding of modern web architecture, performance optimization, and scalable component design. You will work closely with product managers and UX designers to translate complex business requirements into elegant, high-performing user interfaces.\n\nIf you are passionate about pushing the boundaries of what's possible on the web and thrive in a fast-paced, collaborative environment, we want to hear from you.`,
    responsibilities: [
      'Architect and build scalable frontend systems.',
      'Drive the adoption of modern UI frameworks.',
      'Conduct code reviews and set technical standards.',
      'Optimize application performance and accessibility.',
      'Collaborate with cross-functional teams to deliver high-quality features.'
    ],
    requirements: [
      '8+ years of frontend engineering experience.',
      'Expertise in React, TypeScript, and state management.',
      'Proven track record of architectural leadership.',
      'Experience with GraphQL and modern build tools.',
      'Strong communication and mentoring skills.'
    ],
    skills: ['React.js', 'TypeScript', 'System Architecture', 'GraphQL', 'Web Performance'],
    companyAbout: 'We build the infrastructure that powers the next generation of financial services.'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'Nexus Digital',
    location: 'Austin, TX (Remote)',
    type: 'Full-Time',
    level: 'Intermediate',
    salary: '$110k - $150k',
    postedAt: '1 day ago',
    description: 'Join our dynamic team building the future of e-commerce platforms...',
    responsibilities: ['Develop new features', 'Maintain legacy systems'],
    requirements: ['3+ years experience', 'Node.js/React knowledge'],
    skills: ['Node.js', 'React', 'PostgreSQL'],
    companyAbout: 'Leading the way in digital transformation.'
  }
];

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  
  // Find the job from mock data or use the first one as default
  const job = mockJobs.find(j => j.id === id) || mockJobs[0];

  const handleApply = () => {
    alert(`Mock: Đang chuyển hướng đến trang ứng tuyển cho vị trí ${job.title}`);
  };

  return (
    <div className="p-container-padding max-w-7xl mx-auto w-full">
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
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">{job.title}</h1>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="font-body-md text-body-md font-medium text-primary">{job.company}</span>
                  <span>•</span>
                  <span className="font-body-md text-body-md">{job.location}</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-surface-variant/50 shadow-sm">
                <span className="material-symbols-outlined text-[32px] text-primary font-variation-fill">domain</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="bg-primary/10 text-primary font-label-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-primary/20">
                {job.type}
              </span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-surface-variant/50">
                {job.level}
              </span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-surface-variant/50">
                {job.salary}
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

          {/* Responsibilities & Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap-lg">
            <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-surface-variant/50 bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface tracking-wider">Trách nhiệm chính</h3>
              </div>
              <ul className="p-6 space-y-4 flex-grow">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined shrink-0 text-primary mt-0.5 text-[20px]">arrow_right_alt</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-surface-variant/50 bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface tracking-wider">Yêu cầu công việc</h3>
              </div>
              <ul className="p-6 space-y-4 flex-grow">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined shrink-0 text-primary mt-0.5 text-[20px]">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Skills Map Section */}
          <section className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card overflow-hidden">
            <div className="px-8 py-4 border-b border-surface-variant/50 bg-surface-container-low flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface tracking-wider">Kỹ năng liên quan</h3>
            </div>
            <div className="p-6 flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="bg-surface-container text-on-surface-variant font-label-bold text-[12px] px-4 py-2 rounded-xl border border-surface-variant/50 hover:border-primary hover:text-primary cursor-pointer transition-all active:scale-95"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <aside className="lg:w-1/3 flex flex-col gap-stack-gap-lg">
          {/* Apply Action Card */}
          <div className="bg-primary text-on-primary rounded-2xl shadow-xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
            
            <h3 className="font-headline-lg text-headline-lg font-bold mb-2 text-on-primary relative z-10">Sẵn sàng ứng tuyển?</h3>
            <p className="font-body-md text-body-md text-on-primary/80 mb-8 relative z-10">Gia nhập đội ngũ kỹ sư của chúng tôi ngay hôm nay.</p>
            
            <button 
              onClick={handleApply}
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
                { icon: 'calendar_today', label: 'Ngày đăng', value: job.postedAt },
                { icon: 'work', label: 'Loại công việc', value: job.type },
                { icon: 'trending_up', label: 'Kinh nghiệm', value: job.level },
                { icon: 'payments', label: 'Mức lương', value: job.salary },
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

          {/* Company Teaser */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant/50 shadow-ambient-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-primary font-variation-fill">domain</span>
              </div>
              <h4 className="font-body-md text-body-md font-bold text-on-surface">{job.company}</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
              {job.companyAbout}
            </p>
            <button className="w-full text-primary font-label-bold text-[12px] hover:underline flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-primary/5 transition-colors uppercase tracking-wider">
              Xem hồ sơ công ty <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
