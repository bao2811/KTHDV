'use client';

import Link from 'next/link';

// --- MOCK DATA ---
const mockStats = [
  { label: 'Đã ứng tuyển', value: '24', icon: 'send', color: 'primary' },
  { label: 'Đang xem xét', value: '8', icon: 'visibility', color: 'secondary' },
  { label: 'Phỏng vấn', value: '3', icon: 'forum', color: 'tertiary' },
];

const mockRecentApplications = [
  {
    id: 'app-1',
    role: 'Lập trình viên Frontend Cao cấp',
    company: 'Công nghệ TechFlow',
    time: '2 ngày trước',
    status: 'Đang xem xét',
    statusIcon: 'hourglass_empty',
    icon: 'code'
  },
  {
    id: 'app-2',
    role: 'Nhà thiết kế UX/UI',
    company: 'Sáng tạo Catalyst',
    time: '1 tuần trước',
    status: 'Đang phỏng vấn',
    statusIcon: 'event',
    icon: 'design_services'
  },
  {
    id: 'app-3',
    role: 'Quản lý Sản phẩm',
    company: 'Đổi mới Innovate',
    time: '2 tuần trước',
    status: 'Đã ứng tuyển',
    statusIcon: 'check_circle',
    icon: 'architecture'
  }
];

const mockRecommendations = [
  {
    id: 'rec-1',
    title: 'Thiết kế Sản phẩm Trưởng',
    company: 'Nova Workspace',
    location: 'Từ xa',
    tags: ['Figma', 'Hệ thống thiết kế', 'Lãnh đạo']
  },
  {
    id: 'rec-2',
    title: 'Lập trình viên React Cao cấp',
    company: 'Công nghệ Stellar',
    location: 'Hà Nội, VN',
    tags: ['React', 'Next.js', 'TypeScript']
  }
];

export default function CandidateDashboard() {
  return (
    <div className="flex flex-col gap-stack-gap-lg w-full animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">Trung tâm Nghề nghiệp</h2>
          <p className="text-on-surface-variant">Theo dõi tiến độ và khám phá những cơ hội mới.</p>
        </div>
        <div className="flex flex-col items-end gap-2 bg-surface-container-low p-4 rounded-xl border border-surface-variant/50">
          <p className="font-label-bold text-label-bold text-primary uppercase tracking-wider">Độ hoàn thiện hồ sơ</p>
          <div className="flex items-center gap-3">
            <div className="w-48 h-2.5 bg-surface-variant rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-primary rounded-full shadow-[0_0_8px_rgba(70,72,212,0.4)]"></div>
            </div>
            <span className="font-bold text-on-surface text-body-sm">80%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-12 gap-grid-gutter">
        {mockStats.map((stat) => (
          <div 
            key={stat.label}
            className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant flex items-start justify-between group hover:border-primary/50 hover:shadow-ambient-card transition-all duration-300 cursor-default"
          >
            <div>
              <p className="font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">{stat.label}</p>
              <p className="font-headline-xl text-headline-xl text-on-surface group-hover:text-primary transition-colors">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300`}>
              <span className={`material-symbols-outlined text-[28px] text-primary group-hover:fill-1`}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area: Split 8 / 4 */}
      <div className="grid grid-cols-12 gap-grid-gutter">
        {/* Recent Applications (Left Side) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-gap-md">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Ứng tuyển gần đây</h3>
            <Link href="/candidate/applications" className="text-primary font-label-bold text-label-bold hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant overflow-hidden">
            {mockRecentApplications.map((app, index) => (
              <div 
                key={app.id} 
                className={`p-5 flex items-center justify-between hover:bg-surface-container-low transition-all cursor-pointer group ${index !== mockRecentApplications.length - 1 ? 'border-b border-surface-variant' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary">{app.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">{app.role}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{app.company} • Đã nộp {app.time}</p>
                  </div>
                </div>
                <div className={`bg-primary/10 text-primary font-label-bold text-label-bold px-4 py-2 rounded-full flex items-center gap-2 group-hover:scale-105 transition-transform`}>
                  <span className="material-symbols-outlined text-[16px]">{app.statusIcon}</span>
                  {app.status}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Find Jobs Call to Action */}
          <div className="mt-2 bg-surface-container rounded-2xl p-8 border border-surface-variant relative overflow-hidden group">
            <div className="relative z-10 max-w-md">
              <h4 className="font-headline-lg text-headline-lg text-on-surface mb-2">Sẵn sàng cho bước tiến tiếp theo?</h4>
              <p className="text-on-surface-variant mb-6">Khám phá công việc phù hợp với kỹ năng và sở thích của bạn.</p>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm công việc, chức danh hoặc công ty..."
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            <span className="material-symbols-outlined absolute top-1/2 -right-12 -translate-y-1/2 text-[200px] text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
              search_check
            </span>
          </div>
        </div>

        {/* Recommended For You (Right Side) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-stack-gap-md">
          <h3 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Gợi ý cho bạn
          </h3>

          <div className="flex flex-col gap-4">
            {mockRecommendations.map((job) => (
              <div 
                key={job.id} 
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant hover:border-primary/50 hover:shadow-ambient-card transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary transform origin-left transition-transform scale-y-0 group-hover:scale-y-100 duration-300"></div>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1 pr-4">
                    {job.title}
                  </h4>
                  <button className="text-outline hover:text-primary transition-colors active:scale-90 p-1">
                    <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{job.company} • {job.location}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {job.tags.map(tag => (
                    <span key={tag} className="bg-surface-container px-2.5 py-1 rounded-md text-[11px] font-label-bold text-on-surface-variant group-hover:bg-primary/5 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/jobs/${job.id}`}
                  className="block w-full text-center bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-label-bold text-label-bold py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>

          {/* Upgrade Card */}
          <div className="mt-2 bg-gradient-to-br from-primary to-indigo-800 rounded-2xl p-6 shadow-lg text-on-primary relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-white">workspace_premium</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg font-bold mb-2">Nexus Talent Premium</h4>
              <p className="font-body-sm text-body-sm opacity-90 mb-6">Mở khóa tính năng so khớp AI và nhận ưu tiên từ 500+ nhà tuyển dụng hàng đầu.</p>
              <button className="w-full bg-white text-primary font-label-bold text-label-bold py-3 rounded-xl hover:shadow-xl transition-all active:scale-95">
                Nâng cấp ngay
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
