'use client';

import Link from 'next/link';

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  // --- MOCK DATA ---
  const candidate = {
    id: params.id,
    name: 'Nguyễn Minh Hiếu',
    role: 'Kỹ sư Frontend Cao cấp',
    email: 'hieu.nguyen@example.com',
    phone: '+84 912 345 678',
    location: 'Hà Nội, VN',
    github: 'github.com/hieunguyen',
    matchScore: 92,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5h2qnjEZorL6h52BkFpnIRjfDqQdJDWKH63XZDfyRS2KvmTSsIdHm_Zxx0pYzyIGCXSBbErxgJfEJECYq5KYSUq8J-DJTICXESVPEPGM20LqHX53M3_hky0AOtuQdiXrMdwO5bdZ0fKGtBjhLFo8fea6doiH6zm6OS3SRrY3b0UyLfmfKNEG57ZWAxmNk-D0A7aACGXGRw3Dpcr03VaRdomKKXvrlA45bYTo_nXpOr9LMLns4IlZrR5Lz5C5PT5D5AIWuiqxJcxv2',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Figma', 'Jest'],
    experience: [
      {
        title: 'Trưởng nhóm Phát triển Frontend',
        company: 'FPT Software',
        period: 'T3/2021 - Hiện tại • 3 năm 2 tháng',
        description: 'Dẫn dắt quá trình chuyển đổi ứng dụng monolith cũ sang kiến trúc micro-frontend bằng React và Webpack Module Federation, giúp giảm 40% thời gian tải trang.'
      },
      {
        title: 'Kỹ sư UI',
        company: 'VNG Corporation',
        period: 'T6/2018 - T2/2021 • 2 năm 9 tháng',
        description: 'Phát triển thư viện thành phần có thể tái sử dụng, tích hợp chặt chẽ với các token thiết kế từ Figma. Hướng dẫn các lập trình viên cấp dưới về các mẫu thiết kế đáp ứng.'
      }
    ],
    education: [
      {
        school: 'Đại học Bách khoa Hà Nội',
        degree: 'Cử nhân Khoa học Máy tính',
        period: '2014 - 2018'
      }
    ]
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg max-w-7xl mx-auto w-full">
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
          <Link href="/hr/pipeline" className="hover:text-primary transition-colors">Đơn ứng tuyển</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-on-surface">{candidate.name}</span>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold border border-surface-variant text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            CV
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            Liên hệ
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        {/* Left Column (Profile & Skills) */}
        <div className="lg:col-span-4 flex flex-col gap-grid-gutter">
          {/* Profile Header Card */}
          <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-ambient border border-surface-variant/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-container/20 to-secondary-container/10"></div>
            <div className="relative flex flex-col items-center mt-8">
              <div className="relative mb-4">
                <img 
                  alt={`${candidate.name} Profile`} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm" 
                  src={candidate.avatar} 
                />
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-container-lowest" title="Đang hoạt động"></div>
              </div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1 text-center">{candidate.name}</h3>
              <p className="font-body-md text-body-md text-primary font-medium mb-4 text-center">{candidate.role}</p>
              <div className="flex gap-2 mb-6">
                <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-bold text-label-bold">{candidate.matchScore}% Phù hợp</span>
                <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> {candidate.location}
                </span>
              </div>
            </div>
            <div className="border-t border-surface-variant pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline text-[18px]">mail</span>
                {candidate.email}
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline text-[18px]">phone</span>
                {candidate.phone}
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline text-[18px]">link</span>
                <a className="text-primary hover:underline" href={`https://${candidate.github}`} target="_blank" rel="noopener noreferrer">{candidate.github}</a>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-ambient border border-surface-variant/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-body-md text-body-md font-bold text-on-surface">Kỹ năng & Công nghệ</h4>
              <button className="text-primary hover:bg-surface-variant p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1.5 rounded-lg font-label-bold text-label-bold">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Experience & Education) */}
        <div className="lg:col-span-8 flex flex-col gap-grid-gutter">
          {/* Work Experience */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-ambient border border-surface-variant/50">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Kinh nghiệm làm việc</h4>
              <button className="flex items-center gap-2 text-primary font-label-bold text-label-bold hover:bg-surface-variant px-3 py-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span> Thêm
              </button>
            </div>
            <div className="flex flex-col gap-8 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-variant before:to-transparent">
              {candidate.experience.map((exp, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-lowest bg-surface-container text-on-surface-variant shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="material-symbols-outlined text-[18px]">work</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors border border-surface-variant group-hover:border-primary/30 group-hover:shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-body-md text-body-md font-bold text-on-surface">{exp.title}</h5>
                        <p className="font-body-sm text-body-sm text-primary">{exp.company}</p>
                      </div>
                      <button className="text-outline-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                    <p className="font-label-bold text-label-bold text-on-surface-variant mb-3">{exp.period}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-ambient border border-surface-variant/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Học vấn</h4>
            </div>
            <div className="flex flex-col gap-4">
              {candidate.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-surface-variant">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">school</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-body-md text-body-md font-bold text-on-surface">{edu.school}</h5>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{edu.degree}</p>
                    <p className="font-label-bold text-label-bold text-outline mt-1">{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
