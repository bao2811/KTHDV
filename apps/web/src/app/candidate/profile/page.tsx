'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const mockProfile = {
  fullName: 'Nguyễn Văn A',
  phone: '0123456789',
  dateOfBirth: '1998-05-15',
  address: 'Quận 1, TP. Hồ Chí Minh',
  summary: 'Tôi là một lập trình viên Frontend đam mê với React và Next.js. Có 3 năm kinh nghiệm làm việc trong môi trường Agile.',
};

const mockExperiences = [
  {
    id: 'exp-1',
    company: 'NexusTech',
    position: 'Frontend Developer',
    startDate: '2023-01',
    endDate: 'Hiện tại',
    description: 'Phát triển web app sử dụng React, Next.js. Tối ưu performance và SEO.',
  },
  {
    id: 'exp-2',
    company: 'FPT Software',
    position: 'Junior Web Developer',
    startDate: '2021-06',
    endDate: '2022-12',
    description: 'Tham gia các dự án outsource. Làm việc với Vue.js và Node.js.',
  },
];

const mockEducations = [
  {
    id: 'edu-1',
    school: 'Đại học Bách Khoa Hà Nội',
    degree: 'Cử nhân Kỹ thuật',
    major: 'Công nghệ thông tin',
    startDate: '2016',
    endDate: '2021',
  },
];

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education'>('info');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý hồ sơ</h1>
        <p className="text-slate-500 mt-1">Cập nhật thông tin cá nhân, kinh nghiệm và học vấn để thu hút nhà tuyển dụng.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'info' ? 'border-[#3525cd] text-[#3525cd]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'experience' ? 'border-[#3525cd] text-[#3525cd]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Kinh nghiệm
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'education' ? 'border-[#3525cd] text-[#3525cd]' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Học vấn
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
        
        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeTab === 'info' && (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
                <input
                  type="text"
                  defaultValue={mockProfile.fullName}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
                <input
                  type="tel"
                  defaultValue={mockProfile.phone}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Ngày sinh</label>
                <input
                  type="date"
                  defaultValue={mockProfile.dateOfBirth}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Địa chỉ</label>
                <input
                  type="text"
                  defaultValue={mockProfile.address}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Giới thiệu bản thân</label>
              <textarea
                rows={4}
                defaultValue={mockProfile.summary}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                className="px-6 py-2.5 bg-[#3525cd] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: KINH NGHIỆM */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Kinh nghiệm làm việc</h2>
              <button className="flex items-center space-x-1 px-4 py-2 bg-indigo-50 text-[#3525cd] font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Thêm kinh nghiệm</span>
              </button>
            </div>

            <div className="space-y-4">
              {mockExperiences.map((exp) => (
                <div key={exp.id} className="p-5 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors relative group">
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-[#3525cd] hover:bg-indigo-50 rounded-md transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{exp.position}</h3>
                  <div className="text-[#3525cd] font-medium text-sm mt-1">{exp.company}</div>
                  <div className="text-slate-500 text-sm mt-1 flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HỌC VẤN */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Quá trình học tập</h2>
              <button className="flex items-center space-x-1 px-4 py-2 bg-indigo-50 text-[#3525cd] font-medium rounded-lg hover:bg-indigo-100 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Thêm học vấn</span>
              </button>
            </div>

            <div className="space-y-4">
              {mockEducations.map((edu) => (
                <div key={edu.id} className="p-5 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors relative group">
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-[#3525cd] hover:bg-indigo-50 rounded-md transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{edu.school}</h3>
                  <div className="text-slate-700 font-medium text-sm mt-1">{edu.degree} - {edu.major}</div>
                  <div className="text-slate-500 text-sm mt-1 flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
