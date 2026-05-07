'use client';

import Link from 'next/link';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // --- MOCK DATA ---
  const job = {
    id: params.id,
    title: 'Kỹ sư Frontend Cao cấp',
    company: 'Giải pháp Công nghệ TechNova',
    location: 'Hà Nội (Hybrid)',
    type: 'Toàn thời gian',
    level: 'Cấp bậc Cao cấp',
    salary: '45.000.000 - 65.000.000 VNĐ',
    postedAt: '2 ngày trước',
    description: 'Chúng tôi đang tìm kiếm một Kiến trúc sư Frontend Cao cấp có tầm nhìn để dẫn dắt quá trình hiện đại hóa các nền tảng doanh nghiệp cốt lõi. Bạn sẽ chịu trách nhiệm xác định chiến lược kỹ thuật, thiết lập các tiêu chuẩn tốt nhất và hướng dẫn đội ngũ kỹ sư lành nghề.',
    details: 'Vai trò này đòi hỏi sự hiểu biết sâu sắc về kiến trúc web hiện đại, tối ưu hóa hiệu suất và thiết kế thành phần có thể mở rộng. Bạn sẽ làm việc chặt chẽ với các quản lý sản phẩm và nhà thiết kế UX để chuyển đổi các yêu cầu kinh doanh phức tạp thành các giao diện người dùng trang nhã, hiệu suất cao.',
    responsibilities: [
      'Thiết kế và xây dựng các hệ thống frontend có khả năng mở rộng.',
      'Thúc đẩy việc áp dụng các framework UI hiện đại.',
      'Thực hiện đánh giá mã nguồn và thiết lập các tiêu chuẩn kỹ thuật.'
    ],
    requirements: [
      'Hơn 8 năm kinh nghiệm trong lĩnh vực kỹ thuật frontend.',
      'Thành thạo React, TypeScript và quản lý trạng thái (state management).',
      'Đã từng dẫn dắt về mặt kiến trúc hệ thống.'
    ],
    skills: ['React.js', 'TypeScript', 'Kiến trúc hệ thống', 'GraphQL', 'Hiệu suất Web']
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-on-surface-variant mb-2">
        <Link href="/hr/jobs" className="hover:text-primary transition-colors">Tin tuyển dụng</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">{job.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-stack-gap-lg">
        {/* Main Content Area */}
        <div className="flex-grow lg:w-2/3 space-y-stack-gap-lg">
          {/* Job Header Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-gap-lg space-y-stack-gap-md relative">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface">{job.title}</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-stack-gap-sm">
                  {job.company} • {job.location}
                </p>
              </div>
              <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center shrink-0 border border-outline-variant">
                <span className="material-symbols-outlined text-headline-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-stack-gap-sm mt-stack-gap-md">
              <span className="bg-primary/10 text-primary font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-primary/20">{job.type}</span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant">{job.level}</span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant">{job.salary}</span>
            </div>
          </section>

          {/* Job Description Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-lg text-headline-lg">Về vị trí này</h2>
            </div>
            <div className="p-stack-gap-lg space-y-stack-gap-md font-body-md text-body-md text-on-surface-variant">
              <p>{job.description}</p>
              <p>{job.details}</p>
            </div>
          </section>

          {/* Responsibilities & Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-gap-lg">
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
              <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Trách nhiệm chính</h3>
              </div>
              <ul className="flex-grow">
                {job.responsibilities.map((item, idx) => (
                  <li key={idx} className="p-stack-gap-sm border-b border-outline-variant last:border-b-0 flex items-start gap-stack-gap-sm text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined shrink-0 text-primary mt-0.5">arrow_right</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
              <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Yêu cầu công việc</h3>
              </div>
              <ul className="flex-grow">
                {job.requirements.map((item, idx) => (
                  <li key={idx} className="p-stack-gap-sm border-b border-outline-variant last:border-b-0 flex items-start gap-stack-gap-sm text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined shrink-0 text-primary mt-0.5">check</span>
                    <span>{item}</span>
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
                <span key={skill} className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant hover:border-primary hover:text-primary cursor-pointer transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Area */}
        <aside className="lg:w-1/3 flex flex-col gap-stack-gap-lg">
          {/* Apply Action Card */}
          <div className="bg-primary text-on-primary rounded-xl shadow-lg p-stack-gap-lg flex flex-col items-center text-center">
            <h3 className="font-headline-lg text-headline-lg mb-stack-gap-sm text-on-primary">Quản lý ứng viên</h3>
            <p className="font-body-md text-body-md text-on-primary mb-stack-gap-md opacity-90">Xem và đánh giá các ứng viên cho vị trí này.</p>
            <Link 
              href={`/hr/jobs/${job.id}/applicants`}
              className="w-full bg-surface text-primary font-label-bold text-label-bold py-stack-gap-md rounded-lg shadow-sm hover:bg-surface-container transition-colors text-center"
            >
              XEM ỨNG VIÊN
            </Link>
            <button className="mt-stack-gap-sm w-full bg-transparent text-on-primary font-label-bold text-label-bold py-stack-gap-sm rounded-lg hover:bg-surface/10 transition-colors flex items-center justify-center gap-stack-gap-sm">
              <span className="material-symbols-outlined text-[18px]">edit</span> Chỉnh sửa tin tuyển dụng
            </button>
          </div>

          {/* Quick Facts */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Thông tin nhanh</h3>
            </div>
            <div className="p-stack-gap-md space-y-stack-gap-md">
              {[
                { icon: 'calendar_today', label: 'Ngày đăng', value: job.postedAt },
                { icon: 'work', label: 'Loại hình', value: job.type },
                { icon: 'trending_up', label: 'Kinh nghiệm', value: job.level },
                { icon: 'payments', label: 'Mức lương', value: job.salary }
              ].map((fact, idx) => (
                <div key={idx} className="flex items-start gap-stack-gap-md">
                  <span className="material-symbols-outlined text-outline">{fact.icon}</span>
                  <div>
                    <div className="font-label-bold text-label-bold text-outline uppercase mb-1">{fact.label}</div>
                    <div className="font-body-sm text-body-sm text-on-surface font-medium">{fact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
