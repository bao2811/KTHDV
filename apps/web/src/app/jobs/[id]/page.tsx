'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  // --- MOCK DATA ---
  const job = {
    id: params.id,
    title: 'Senior Frontend Developer (React/Next.js)',
    company: { 
      name: 'NexusTech', 
      logo: 'code',
      description: 'NexusTech là công ty công nghệ hàng đầu về các giải pháp SaaS cho doanh nghiệp. Chúng tôi xây dựng sản phẩm phục vụ hàng triệu người dùng toàn cầu.',
      website: 'https://nexustech.example.com',
      size: '100 - 499 nhân viên',
      location: 'Hồ Chí Minh (Hybrid)'
    },
    location: 'Hồ Chí Minh',
    jobType: 'FULL_TIME',
    salaryMin: 20000000,
    salaryMax: 45000000,
    experience: '3 - 5 năm',
    status: 'ACTIVE',
    skills: [
      { name: 'React', level: 'REQUIRED' },
      { name: 'Next.js', level: 'REQUIRED' },
      { name: 'TypeScript', level: 'REQUIRED' },
      { name: 'TailwindCSS', level: 'NICE_TO_HAVE' },
      { name: 'GraphQL', level: 'NICE_TO_HAVE' }
    ],
    description: `
      <p>Chúng tôi đang tìm kiếm một Senior Frontend Developer gia nhập đội ngũ phát triển sản phẩm cốt lõi. Bạn sẽ chịu trách nhiệm xây dựng các giao diện web phức tạp, tối ưu hóa hiệu năng và mang lại trải nghiệm người dùng tuyệt vời.</p>
      <br/>
      <p>Với vai trò này, bạn cần hiểu biết sâu sắc về kiến trúc ứng dụng hiện đại, tối ưu hóa hiệu suất và thiết kế component mở rộng được. Bạn sẽ làm việc chặt chẽ với product managers và UI/UX designers để chuyển các yêu cầu nghiệp vụ phức tạp thành các giao diện mượt mà và trực quan.</p>
    `,
    responsibilities: [
      "Phát triển các tính năng mới bằng React.js và Next.js.",
      "Tối ưu hóa hiệu năng ứng dụng web (Core Web Vitals).",
      "Review code và hướng dẫn các thành viên junior trong team.",
      "Phối hợp chặt chẽ với team UI/UX Designer và Backend Engineer."
    ],
    requirements: [
      "Có ít nhất 3 năm kinh nghiệm lập trình Frontend.",
      "Thành thạo React, TypeScript và quản lý State.",
      "Có kinh nghiệm xây dựng kiến trúc mở rộng."
    ],
    postedAt: '2 ngày trước',
    expiresAt: '12/11/2026'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (!isClient) return null;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-surface-container-lowest text-primary border-b border-outline-variant w-full shadow-sm flex justify-between items-center px-container-padding py-stack-gap-md sticky top-0 z-50">
        <Link href="/" className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined icon-fill">token</span>
          NexusTalent
        </Link>
        <nav className="hidden md:flex gap-stack-gap-lg">
          <Link href="/jobs" className="text-primary font-bold border-b-2 border-primary font-body-md text-body-md pb-1">
            Tìm việc làm
          </Link>
          <Link href="/candidate/dashboard" className="text-on-surface-variant hover:text-primary font-body-md text-body-md hover:bg-surface-container transition-colors rounded-lg px-stack-gap-sm py-1">
            Candidate Portal
          </Link>
        </nav>
        <div className="flex gap-stack-gap-sm">
          {!userRole ? (
            <>
              <Link href="/login" className="font-label-bold text-label-bold text-on-surface bg-surface border border-outline-variant rounded-lg px-stack-gap-md py-stack-gap-sm hover:bg-surface-container transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" className="font-label-bold text-label-bold text-on-primary bg-primary rounded-lg shadow-sm px-stack-gap-md py-stack-gap-sm hover:bg-primary/90 transition-colors">
                Đăng ký
              </Link>
            </>
          ) : (
            <Link href={`/${userRole}`} className="font-label-bold text-label-bold text-on-surface bg-surface border border-outline-variant rounded-lg px-stack-gap-md py-stack-gap-sm hover:bg-surface-container transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              Dashboard
            </Link>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-container-padding py-stack-gap-lg flex flex-col lg:flex-row gap-stack-gap-lg max-w-7xl">
        {/* Main Content Area */}
        <div className="flex-grow lg:w-2/3 space-y-stack-gap-lg">
          
          {/* Job Header Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-gap-lg space-y-stack-gap-md relative">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface">{job.title}</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-stack-gap-sm">
                  {job.company.name} • {job.company.location}
                </p>
              </div>
              <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center shrink-0 border border-outline-variant">
                <span className="material-symbols-outlined text-headline-lg text-primary icon-fill">
                  {job.company.logo}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-stack-gap-sm mt-stack-gap-md">
              <span className="bg-primary-container/20 text-primary font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-primary/20 uppercase">
                {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType === 'REMOTE' ? 'Remote' : 'Bán thời gian'}
              </span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant uppercase">
                {job.experience}
              </span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant uppercase">
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
              </span>
            </div>
          </section>

          {/* Job Description Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-lg text-headline-lg">Về công việc này</h2>
            </div>
            <div className="p-stack-gap-lg space-y-stack-gap-md font-body-md text-body-md text-on-surface-variant">
              <div dangerouslySetInnerHTML={{ __html: job.description }} className="space-y-4" />
            </div>
          </section>

          {/* Responsibilities & Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap-lg">
            
            {/* Responsibilities */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
              <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Trách nhiệm</h3>
              </div>
              <ul className="flex-grow">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="p-stack-gap-sm border-b border-outline-variant last:border-b-0 flex items-start gap-stack-gap-sm text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined shrink-0 text-primary mt-0.5">arrow_right</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
              <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Yêu cầu</h3>
              </div>
              <ul className="flex-grow">
                {job.requirements.map((req, index) => (
                  <li key={index} className="p-stack-gap-sm border-b border-outline-variant last:border-b-0 flex items-start gap-stack-gap-sm text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined shrink-0 text-primary mt-0.5">check</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Skills Map Section */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low flex items-center gap-stack-gap-sm">
              <span className="material-symbols-outlined text-primary">hub</span>
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Kỹ năng liên quan</h3>
            </div>
            <div className="p-stack-gap-md flex flex-wrap gap-stack-gap-sm">
              {job.skills.map((skill) => (
                <span key={skill.name} className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant hover:border-primary hover:text-primary cursor-pointer transition-colors">
                  {skill.name}
                </span>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Area */}
        <aside className="lg:w-1/3 flex flex-col gap-stack-gap-lg">
          
          {/* Apply Action Card */}
          <div className="bg-primary text-on-primary rounded-xl shadow-lg p-stack-gap-lg flex flex-col items-center text-center">
            <h3 className="font-headline-lg text-headline-lg mb-stack-gap-sm text-on-primary">Bạn đã sẵn sàng?</h3>
            <p className="font-body-md text-body-md text-on-primary mb-stack-gap-md opacity-90">Gia nhập đội ngũ của chúng tôi ngay hôm nay.</p>
            
            {userRole === 'candidate' ? (
              <button 
                onClick={() => router.push(`/jobs/${job.id}/apply`)}
                className="w-full bg-surface text-primary font-label-bold text-label-bold py-stack-gap-md rounded-lg shadow-sm hover:bg-surface-container transition-colors uppercase tracking-wider"
              >
                ỨNG TUYỂN NGAY
              </button>
            ) : userRole ? (
              <div className="w-full bg-surface/10 border border-surface/20 rounded-lg py-stack-gap-md px-4 text-sm text-on-primary font-medium">
                Bạn đang đăng nhập dưới quyền <strong className="uppercase">{userRole}</strong>.
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="w-full bg-surface text-primary font-label-bold text-label-bold py-stack-gap-md rounded-lg shadow-sm hover:bg-surface-container transition-colors uppercase tracking-wider"
              >
                ĐĂNG NHẬP ĐỂ ỨNG TUYỂN
              </button>
            )}
            
            <button className="mt-stack-gap-sm w-full bg-transparent text-on-primary font-label-bold text-label-bold py-stack-gap-sm rounded-lg hover:bg-surface/10 transition-colors flex items-center justify-center gap-stack-gap-sm uppercase">
              <span className="material-symbols-outlined text-[18px]">bookmark</span> 
              Lưu công việc
            </button>
          </div>

          {/* Quick Facts */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Thông tin nhanh</h3>
            </div>
            <div className="p-stack-gap-md space-y-stack-gap-md">
              <div className="flex items-start gap-stack-gap-md">
                <span className="material-symbols-outlined text-outline">calendar_today</span>
                <div>
                  <div className="font-label-bold text-label-bold text-outline uppercase mb-1">Ngày đăng</div>
                  <div className="font-body-sm text-body-sm text-on-surface font-medium">{job.postedAt}</div>
                </div>
              </div>
              <div className="flex items-start gap-stack-gap-md">
                <span className="material-symbols-outlined text-outline">event_busy</span>
                <div>
                  <div className="font-label-bold text-label-bold text-outline uppercase mb-1">Hết hạn</div>
                  <div className="font-body-sm text-body-sm text-on-surface font-medium">{job.expiresAt}</div>
                </div>
              </div>
              <div className="flex items-start gap-stack-gap-md">
                <span className="material-symbols-outlined text-outline">work</span>
                <div>
                  <div className="font-label-bold text-label-bold text-outline uppercase mb-1">Loại công việc</div>
                  <div className="font-body-sm text-body-sm text-on-surface font-medium">{job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType}</div>
                </div>
              </div>
              <div className="flex items-start gap-stack-gap-md">
                <span className="material-symbols-outlined text-outline">trending_up</span>
                <div>
                  <div className="font-label-bold text-label-bold text-outline uppercase mb-1">Kinh nghiệm</div>
                  <div className="font-body-sm text-body-sm text-on-surface font-medium">{job.experience}</div>
                </div>
              </div>
              <div className="flex items-start gap-stack-gap-md">
                <span className="material-symbols-outlined text-outline">payments</span>
                <div>
                  <div className="font-label-bold text-label-bold text-outline uppercase mb-1">Mức lương</div>
                  <div className="font-body-sm text-body-sm text-on-surface font-medium">{formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Teaser */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-gap-md">
            <div className="flex items-center gap-stack-gap-sm mb-stack-gap-sm">
              <div className="w-8 h-8 bg-surface-container rounded border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-primary icon-fill">{job.company.logo}</span>
              </div>
              <h4 className="font-label-bold text-label-bold text-on-surface">{job.company.name}</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-gap-md line-clamp-3">
              {job.company.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span className="font-medium text-gray-900">{job.company.size}</span>
            </div>
            <Link href={job.company.website} target="_blank" className="font-label-bold text-label-bold text-primary hover:underline flex items-center gap-1">
              Xem hồ sơ công ty <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </aside>
      </main>

    </div>
  );
}
