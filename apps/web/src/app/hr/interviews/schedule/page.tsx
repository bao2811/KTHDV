'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ScheduleInterview() {
  const [formData, setFormData] = useState({
    jobId: '',
    candidateId: '',
    date: '',
    time: '',
    duration: '60',
    type: 'ONLINE',
    link: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Đã xếp lịch phỏng vấn!');
    // Redirect logic would go here
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/hr/interviews" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xếp Lịch Phỏng Vấn</h1>
          <p className="text-slate-500 mt-1">Lên lịch gặp ứng viên cho vòng phỏng vấn</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Vị trí tuyển dụng <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.jobId}
                onChange={e => setFormData({...formData, jobId: e.target.value})}
                required
              >
                <option value="">Chọn vị trí...</option>
                <option value="1">Senior Frontend Developer</option>
                <option value="2">Backend Engineer (Java)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Ứng viên <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.candidateId}
                onChange={e => setFormData({...formData, candidateId: e.target.value})}
                required
              >
                <option value="">Chọn ứng viên...</option>
                <option value="c1">Nguyễn Văn A</option>
                <option value="c2">Trần Thị B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Ngày phỏng vấn <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Giờ bắt đầu <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Thời lượng (phút) <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                required
              >
                <option value="30">30 phút</option>
                <option value="45">45 phút</option>
                <option value="60">60 phút (1 giờ)</option>
                <option value="90">90 phút (1.5 giờ)</option>
                <option value="120">120 phút (2 giờ)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Hình thức <span className="text-red-500">*</span></label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="ONLINE">Trực tuyến (Online)</option>
                <option value="IN_PERSON">Trực tiếp (Offline)</option>
              </select>
            </div>
          </div>

          {formData.type === 'ONLINE' ? (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Link cuộc họp (Google Meet/Zoom)</label>
              <input 
                type="url" 
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Địa điểm phỏng vấn</label>
              <input 
                type="text" 
                placeholder="Phòng họp A, Tầng 3, Tòa nhà X..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all"
                value={formData.link}
                onChange={e => setFormData({...formData, link: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Ghi chú cho ứng viên</label>
            <textarea 
              rows={4}
              placeholder="Chuẩn bị CV bản cứng, đến sớm 10 phút..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-all resize-none"
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              href="/hr/interviews"
              className="px-6 py-2.5 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Hủy
            </Link>
            <button 
              type="submit"
              className="px-6 py-2.5 text-white font-bold bg-[#3525cd] hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              Lưu & Gửi Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
