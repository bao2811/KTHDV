'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React/Next.js)',
    company: { name: 'NexusTech', logo: 'N' },
    location: 'Hồ Chí Minh',
    jobType: 'FULL_TIME',
    salaryMin: 20000000,
    salaryMax: 45000000,
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
    postedAt: '2 giờ trước',
  },
  {
    id: 'job-2',
    title: 'Backend Engineer (Node.js/NestJS)',
    company: { name: 'Global Solutions', logo: 'G' },
    location: 'Hà Nội',
    jobType: 'REMOTE',
    salaryMin: 25000000,
    salaryMax: 50000000,
    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
    postedAt: '5 giờ trước',
  },
  {
    id: 'job-3',
    title: 'UI/UX Product Designer',
    company: { name: 'Creative Minds', logo: 'C' },
    location: 'Hồ Chí Minh',
    jobType: 'FULL_TIME',
    salaryMin: 15000000,
    salaryMax: 30000000,
    skills: ['Figma', 'Prototyping', 'User Research'],
    postedAt: '1 ngày trước',
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer (AWS/Kubernetes)',
    company: { name: 'Cloudify', logo: 'C' },
    location: 'Đà Nẵng',
    jobType: 'FULL_TIME',
    salaryMin: 30000000,
    salaryMax: 60000000,
    skills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform'],
    postedAt: '2 ngày trước',
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
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Navbar (Public) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#3525cd] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl font-light">token</span>
            Nexus<span className="text-gray-900 font-medium">Talent</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-[#3525cd] font-medium px-4 py-2">
              Đăng nhập
            </Link>
            <Link href="/register" className="bg-[#3525cd] hover:bg-[#2b1da5] text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-md shadow-[#3525cd]/20">
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-[#3525cd]/10 via-indigo-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Khám phá cơ hội nghề nghiệp lý tưởng
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Hàng ngàn công việc IT chất lượng đang chờ đón bạn.
          </p>
          
          <div className="bg-white p-3 rounded-2xl shadow-xl shadow-indigo-100/50 flex flex-col md:flex-row gap-3 border border-gray-100">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border border-transparent focus-within:border-[#3525cd]/30 focus-within:bg-white transition-colors">
              <span className="material-symbols-outlined text-gray-400">search</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm công việc, kỹ năng, công ty..." 
                className="w-full bg-transparent border-none outline-none px-3 py-3.5 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#3525cd] hover:bg-[#2b1da5] text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-[#3525cd]/20 flex items-center justify-center gap-2">
              Tìm việc ngay
            </button>
          </div>
        </div>
      </div>

      {/* Main Content & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
                <button className="text-sm text-[#3525cd] hover:underline font-medium">Xóa lọc</button>
              </div>

              <div className="space-y-6">
                {/* Ngành nghề */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Ngành nghề</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]">
                    <option>Tất cả ngành nghề</option>
                    <option>IT - Phần mềm</option>
                    <option>Thiết kế - UX/UI</option>
                    <option>Marketing</option>
                  </select>
                </div>

                {/* Địa điểm */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Địa điểm</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]">
                    <option>Tất cả địa điểm</option>
                    <option>Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>

                {/* Loại hình */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Loại hình</label>
                  <div className="space-y-2.5">
                    {['Toàn thời gian', 'Bán thời gian', 'Làm từ xa (Remote)'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#3525cd] focus:ring-[#3525cd] cursor-pointer" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Tìm thấy <span className="text-[#3525cd]">{MOCK_JOBS.length}</span> việc làm phù hợp
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sắp xếp theo:</span>
                <select className="border-none bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer">
                  <option>Mới nhất</option>
                  <option>Lương cao nhất</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MOCK_JOBS.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-l-4 border-l-transparent hover:border-l-[#3525cd]">
                    <div className="flex gap-4 items-start mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-xl font-bold text-[#3525cd]">
                        {job.company.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#3525cd] transition-colors line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{job.company.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-[#3525cd] text-xs font-medium">
                        <span className="material-symbols-outlined text-[14px]">payments</span>
                        {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                      {job.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-md border border-gray-100 text-gray-500 text-[11px] font-medium bg-white">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-2.5 py-1 rounded-md border border-gray-100 text-gray-500 text-[11px] font-medium bg-white">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {job.postedAt}
                      </span>
                      <span className="text-sm font-semibold text-[#3525cd] group-hover:underline">
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-10 flex justify-center">
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-xl bg-[#3525cd] text-white flex items-center justify-center font-semibold shadow-md shadow-[#3525cd]/20">1</button>
                <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-semibold transition-colors">2</button>
                <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-semibold transition-colors">3</button>
                <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
