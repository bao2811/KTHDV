'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Đã tạo tin tuyển dụng và gửi duyệt thành công!');
      router.push('/hr/jobs');
    }, 1000);
  };

  const handleSaveDraft = () => {
    alert('Đã lưu nháp!');
    router.push('/hr/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
        <Link href="/hr/jobs" className="hover:text-[#3525cd]">Quản lý tin tuyển dụng</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-slate-900 font-medium">Tạo tin mới</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tạo tin tuyển dụng mới</h1>
        <p className="text-slate-500 mt-1">Điền thông tin chi tiết để đăng tin tìm kiếm ứng viên.</p>
      </div>

      {/* Form Steps Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#3525cd] z-0 transition-all duration-300" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}></div>
        
        <div className={`relative z-10 flex flex-col items-center ${currentStep >= 1 ? 'text-[#3525cd]' : 'text-slate-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${currentStep >= 1 ? 'bg-[#3525cd] text-white ring-4 ring-indigo-50' : 'bg-slate-200 text-slate-500'}`}>
            1
          </div>
          <span className="text-xs font-medium bg-[#f8f9ff] px-2">Thông tin cơ bản</span>
        </div>
        
        <div className={`relative z-10 flex flex-col items-center ${currentStep >= 2 ? 'text-[#3525cd]' : 'text-slate-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${currentStep >= 2 ? 'bg-[#3525cd] text-white ring-4 ring-indigo-50' : 'bg-slate-200 text-slate-500'}`}>
            2
          </div>
          <span className="text-xs font-medium bg-[#f8f9ff] px-2">Yêu cầu kỹ năng</span>
        </div>
        
        <div className={`relative z-10 flex flex-col items-center ${currentStep >= 3 ? 'text-[#3525cd]' : 'text-slate-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${currentStep >= 3 ? 'bg-[#3525cd] text-white ring-4 ring-indigo-50' : 'bg-slate-200 text-slate-500'}`}>
            3
          </div>
          <span className="text-xs font-medium bg-[#f8f9ff] px-2">Hard Filters</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Tiêu đề công việc <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="VD: Senior React Developer" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Công ty <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors bg-white">
                      <option>NexusTech</option>
                      <option>Global Solutions</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Địa điểm <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors bg-white">
                      <option>Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Loại hình <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors bg-white">
                      <option>FULL_TIME</option>
                      <option>PART_TIME</option>
                      <option>REMOTE</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Lương tối thiểu (VND)</label>
                    <input type="number" placeholder="20000000" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Lương tối đa (VND)</label>
                    <input type="number" placeholder="45000000" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Mô tả công việc <span className="text-red-500">*</span></label>
                  <textarea rows={6} placeholder="Nhập mô tả chi tiết công việc..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors resize-y" required></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills */}
          {currentStep === 2 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Kỹ năng yêu cầu</h3>
                <button type="button" className="flex items-center space-x-1 text-sm text-[#3525cd] font-medium hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm kỹ năng
                </button>
              </div>

              <div className="space-y-3">
                {/* Mock Skill Item 1 */}
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] bg-white">
                      <option>React</option>
                      <option>Node.js</option>
                      <option>TypeScript</option>
                    </select>
                  </div>
                  <div className="w-40">
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] bg-white">
                      <option>Bắt buộc</option>
                      <option>Ưu tiên</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <input type="number" placeholder="Số năm" defaultValue={2} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd]" />
                  </div>
                  <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>

                {/* Mock Skill Item 2 */}
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] bg-white">
                      <option>TypeScript</option>
                      <option>React</option>
                      <option>Node.js</option>
                    </select>
                  </div>
                  <div className="w-40">
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] bg-white">
                      <option>Bắt buộc</option>
                      <option>Ưu tiên</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <input type="number" placeholder="Số năm" defaultValue={1} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd]" />
                  </div>
                  <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Hard Filters */}
          {currentStep === 3 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Bộ lọc cứng (Hard Filters)</h3>
                <button type="button" className="flex items-center space-x-1 text-sm text-[#3525cd] font-medium hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm bộ lọc
                </button>
              </div>
              <p className="text-sm text-slate-500">Ứng viên không thỏa mãn các bộ lọc này sẽ tự động bị loại khi hệ thống chạy so khớp.</p>

              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] bg-white">
                      <option>GPA Tối thiểu</option>
                      <option>Năm kinh nghiệm tối thiểu</option>
                      <option>Bằng cấp bắt buộc</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] bg-white">
                      <option>{'>='}</option>
                      <option>{'=='}</option>
                      <option>{'<='}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input type="text" placeholder="Giá trị" defaultValue="3.0" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd]" />
                  </div>
                  <button type="button" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <div>
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-[#3525cd] transition-colors shadow-sm"
                >
                  Quay lại
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleSaveDraft}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-[#3525cd] transition-colors shadow-sm"
                >
                  Lưu nháp
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2.5 bg-[#3525cd] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                >
                  Tiếp theo
                  <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><span className="material-symbols-outlined animate-spin text-[18px] mr-2">refresh</span> Đang xử lý...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px] mr-2">send</span> Gửi duyệt</>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
