'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const mockProfile = {
  fullName: 'Nguyễn Văn A',
  title: 'Kỹ sư Frontend Cao cấp',
  phone: '0123456789',
  email: 'nguyenvana@example.com',
  github: 'github.com/nguyenvana',
  dateOfBirth: '1998-05-15',
  location: 'Hồ Chí Minh',
  matchScore: 92,
  avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=6063ee&color=fff',
  summary: 'Tôi là một lập trình viên Frontend đam mê với React và Next.js. Có 3 năm kinh nghiệm làm việc trong môi trường Agile.',
  skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Figma', 'Next.js', 'GraphQL', 'Jest'],
};

const mockExperiences = [
  {
    id: 'exp-1',
    company: 'NexusTech',
    position: 'Trưởng nhóm Phát triển Frontend',
    startDate: 'Tháng 3 2021',
    endDate: 'Hiện tại',
    duration: '3 năm 2 tháng',
    description: 'Phát triển web app sử dụng React, Next.js. Tối ưu performance và SEO, giảm 40% thời gian tải trang.',
    icon: 'work',
    isCurrent: true
  },
  {
    id: 'exp-2',
    company: 'FPT Software',
    position: 'Kỹ sư UI',
    startDate: 'Tháng 6 2018',
    endDate: 'Tháng 2 2021',
    duration: '2 năm 9 tháng',
    description: 'Phát triển các component library tái sử dụng. Tích hợp chặt chẽ với Figma design tokens.',
    icon: 'business_center',
    isCurrent: false
  },
];

const mockEducations = [
  {
    id: 'edu-1',
    school: 'Đại học Bách Khoa TP.HCM',
    degree: 'Cử nhân Kỹ thuật',
    major: 'Khoa học máy tính',
    startDate: '2014',
    endDate: '2018',
  },
];

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState<'INFO' | 'EXPERIENCE' | 'EDUCATION'>('INFO');

  return (
    <div className="flex flex-col gap-stack-gap-lg w-full">
      
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
          <Link href="/candidate" className="hover:text-primary transition-colors">Ứng viên</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="font-bold text-on-surface">Hồ sơ của tôi</span>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Tải xuống CV
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-bold text-label-bold bg-primary text-on-primary hover:bg-primary-fixed-variant transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        
        {/* Left Column (Profile & Skills) */}
        <div className="lg:col-span-4 flex flex-col gap-grid-gutter">
          
          {/* Profile Header Card */}
          <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-sm border border-surface-variant/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-container/30 to-secondary-container/10"></div>
            <div className="relative flex flex-col items-center mt-8">
              <div className="relative">
                <img 
                  src={mockProfile.avatar} 
                  alt={mockProfile.fullName} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm mb-4" 
                />
                <div className="absolute bottom-4 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-container-lowest" title="Online"></div>
              </div>
              
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1 text-center">{mockProfile.fullName}</h3>
              <p className="font-body-md text-body-md text-primary font-medium mb-4 text-center">{mockProfile.title}</p>
              
              <div className="flex gap-2 mb-6">
                <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-bold text-label-bold">
                  {mockProfile.matchScore}% Phù hợp
                </span>
                <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full font-label-bold text-label-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span> 
                  {mockProfile.location}
                </span>
              </div>
            </div>
            
            <div className="border-t border-surface-variant pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline">mail</span>
                {mockProfile.email}
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline">phone</span>
                {mockProfile.phone}
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-outline">link</span>
                <Link href="#" className="text-primary hover:underline">{mockProfile.github}</Link>
              </div>
            </div>
          </div>
          
          {/* Skills Card */}
          <div className="bg-surface-container-lowest rounded-[16px] p-6 shadow-sm border border-surface-variant/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-body-md text-body-md font-bold text-on-surface">Kỹ năng & Công nghệ</h4>
              <button className="text-primary hover:bg-surface-variant p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockProfile.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1.5 rounded-lg font-label-bold text-label-bold ${
                    index < 3 
                      ? 'bg-secondary-fixed text-on-secondary-fixed-variant' 
                      : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
        </div>
        
        {/* Right Column (Experience & Education) */}
        <div className="lg:col-span-8 flex flex-col gap-grid-gutter">
          
          {/* About Me */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-sm border border-surface-variant/50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Giới thiệu bản thân</h4>
              <button className="text-outline-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {mockProfile.summary}
            </p>
          </div>

          {/* Work Experience */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-sm border border-surface-variant/50">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Kinh nghiệm làm việc</h4>
              <button className="flex items-center gap-2 text-primary font-label-bold text-label-bold hover:bg-surface-variant px-3 py-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span> Thêm
              </button>
            </div>
            
            <div className="flex flex-col gap-8 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-variant before:to-transparent">
              {mockExperiences.map((exp, index) => (
                <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-lowest shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                    exp.isCurrent ? 'bg-primary-container text-on-primary-container shadow-sm' : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{exp.icon}</span>
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-surface hover:bg-surface-container transition-colors border border-surface-variant group-hover:border-primary/30 group-hover:shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-body-md text-body-md font-bold text-on-surface">{exp.position}</h5>
                        <p className={`font-body-sm text-body-sm ${exp.isCurrent ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>{exp.company}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </div>
                    <p className="font-label-bold text-label-bold text-on-surface-variant mb-3">{exp.startDate} - {exp.endDate} • {exp.duration}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-surface-container-lowest rounded-[16px] p-8 shadow-sm border border-surface-variant/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Học vấn</h4>
              <button className="flex items-center gap-2 text-primary font-label-bold text-label-bold hover:bg-surface-variant px-3 py-2 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span> Thêm
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {mockEducations.map(edu => (
                <div key={edu.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors border border-transparent hover:border-surface-variant group">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">school</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-body-md text-body-md font-bold text-on-surface">{edu.school}</h5>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{edu.degree}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button className="p-2 text-outline hover:text-error transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </div>
                    <p className="font-label-bold text-label-bold text-outline mt-1">{edu.startDate} - {edu.endDate}</p>
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
