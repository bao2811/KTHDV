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
      logo: 'N',
      description: 'NexusTech là công ty công nghệ hàng đầu về các giải pháp SaaS cho doanh nghiệp. Chúng tôi xây dựng sản phẩm phục vụ hàng triệu người dùng toàn cầu.',
      website: 'https://nexustech.example.com',
      size: '100 - 499 nhân viên'
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
      <p><strong>Trách nhiệm công việc:</strong></p>
      <ul>
        <li>Phát triển các tính năng mới bằng React.js và Next.js.</li>
        <li>Tối ưu hóa hiệu năng ứng dụng web (Core Web Vitals).</li>
        <li>Review code và hướng dẫn các thành viên junior trong team.</li>
        <li>Phối hợp chặt chẽ với team UI/UX Designer và Backend Engineer.</li>
      </ul>
      <br/>
      <p><strong>Quyền lợi:</strong></p>
      <ul>
        <li>Lương tháng 13 + Thưởng hiệu quả công việc.</li>
        <li>Bảo hiểm sức khỏe cao cấp (PVI).</li>
        <li>Môi trường làm việc linh hoạt (Hybrid: 3 ngày office, 2 ngày remote).</li>
        <li>Được cấp MacBook Pro đời mới.</li>
      </ul>
    `,
    postedAt: '12/10/2023',
    expiresAt: '12/11/2023'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Navbar (Public) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#3525cd] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl font-light">token</span>
            Nexus<span className="text-gray-900 font-medium">Talent</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/jobs" className="text-gray-600 hover:text-[#3525cd] font-medium px-4 py-2 mr-4">
              Việc làm
            </Link>
            {!userRole ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-[#3525cd] font-medium px-4 py-2">
                  Đăng nhập
                </Link>
                <Link href="/register" className="bg-[#3525cd] hover:bg-[#2b1da5] text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md shadow-[#3525cd]/20">
                  Đăng ký
                </Link>
              </>
            ) : (
              <Link href={`/${userRole}`} className="flex items-center gap-2 text-gray-700 hover:text-[#3525cd] font-medium bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">dashboard</span>
                Vào Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 gap-2">
          <Link href="/" className="hover:text-[#3525cd] hover:underline">Trang chủ</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href="/jobs" className="hover:text-[#3525cd] hover:underline">Việc làm</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-gray-900 font-medium truncate">{job.title}</span>
        </nav>

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-70"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-gray-50 flex items-center justify-center flex-shrink-0 text-4xl font-bold text-[#3525cd]">
              {job.company.logo}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-100">
                  Đang Tuyển
                </span>
              </div>
              <Link href="#" className="text-lg text-[#3525cd] hover:underline font-medium block mb-4">
                {job.company.name}
              </Link>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">location_on</span>
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-[#3525cd] bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                </span>
                <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">work</span>
                  {job.jobType === 'FULL_TIME' ? 'Toàn thời gian' : job.jobType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Body: 2 Columns */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Job Info */}
          <div className="flex-1 space-y-8">
            {/* Skills Requirement */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">psychology</span>
                Yêu cầu kỹ năng
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50">
                    <span className="text-sm font-semibold text-gray-800">{skill.name}</span>
                    {skill.level === 'REQUIRED' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 uppercase">Bắt buộc</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">Ưu tiên</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd]">description</span>
                Chi tiết công việc
              </h2>
              {/* Note: In a real app, sanitize the HTML before dangerouslySetInnerHTML */}
              <div 
                className="prose prose-indigo max-w-none text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              
              {/* Apply Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#3525cd]/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3525cd] to-purple-500"></div>
                
                {userRole === 'candidate' ? (
                  <button 
                    onClick={() => router.push(`/jobs/${job.id}/apply`)}
                    className="w-full bg-[#3525cd] hover:bg-[#2b1da5] text-white px-6 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-[#3525cd]/25 flex items-center justify-center gap-2 text-lg hover:-translate-y-1"
                  >
                    Ứng tuyển ngay
                    <span className="material-symbols-outlined">send</span>
                  </button>
                ) : userRole ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Bạn đang đăng nhập dưới quyền <strong className="uppercase">{userRole}</strong>. Không thể ứng tuyển.</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Vui lòng đăng nhập để ứng tuyển</p>
                    <Link href="/login" className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                      Đăng nhập
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                      <span className="text-sm font-medium">Ngày đăng</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{job.postedAt}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="material-symbols-outlined text-[20px]">event_busy</span>
                      <span className="text-sm font-medium">Hết hạn</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{job.expiresAt}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
                      <span className="text-sm font-medium">Kinh nghiệm</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{job.experience}</span>
                  </div>
                </div>
              </div>

              {/* Company Info Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400">apartment</span>
                  Về công ty
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-xl font-bold text-[#3525cd]">
                    {job.company.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{job.company.name}</h4>
                    <Link href={job.company.website} className="text-sm text-[#3525cd] hover:underline truncate w-40 block">
                      {job.company.website}
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {job.company.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  Quy mô: <span className="font-medium text-gray-900">{job.company.size}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
