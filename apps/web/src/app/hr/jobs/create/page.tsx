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
    <div className="max-w-4xl mx-auto flex flex-col gap-stack-gap-lg">
      <div className="flex items-center gap-stack-gap-sm font-body-sm text-body-sm text-on-surface-variant mb-stack-gap-md">
        <Link href="/hr/jobs" className="hover:text-primary transition-colors">Quản lý tin tuyển dụng</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Tạo tin mới</span>
      </div>

      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface">Tạo tin tuyển dụng mới</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Điền thông tin chi tiết để đăng tin tìm kiếm ứng viên.</p>
      </div>

      {/* Form Steps Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-surface-variant z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-300" style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}></div>
        
        <div className={`relative z-10 flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-outline-variant'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-label-bold mb-2 transition-colors ${currentStep >= 1 ? 'bg-primary text-on-primary ring-4 ring-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
            1
          </div>
          <span className="font-label-bold text-label-bold bg-background px-2">Thông tin cơ bản</span>
        </div>
        
        <div className={`relative z-10 flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-outline-variant'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-label-bold mb-2 transition-colors ${currentStep >= 2 ? 'bg-primary text-on-primary ring-4 ring-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
            2
          </div>
          <span className="font-label-bold text-label-bold bg-background px-2">Yêu cầu kỹ năng</span>
        </div>
        
        <div className={`relative z-10 flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-outline-variant'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-bold text-label-bold mb-2 transition-colors ${currentStep >= 3 ? 'bg-primary text-on-primary ring-4 ring-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
            3
          </div>
          <span className="font-label-bold text-label-bold bg-background px-2">Bộ lọc cứng</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant overflow-hidden">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col gap-stack-gap-md">
                <div className="flex flex-col gap-stack-gap-sm">
                  <label className="font-label-bold text-label-bold text-on-surface">Tiêu đề công việc <span className="text-error">*</span></label>
                  <input type="text" placeholder="VD: Lập trình viên React Cao cấp" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
                  <div className="flex flex-col gap-stack-gap-sm">
                    <label className="font-label-bold text-label-bold text-on-surface">Công ty <span className="text-error">*</span></label>
                    <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>Giải pháp TechNova</option>
                      <option>Giải pháp Toàn cầu</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-stack-gap-sm">
                    <label className="font-label-bold text-label-bold text-on-surface">Địa điểm <span className="text-error">*</span></label>
                    <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter">
                  <div className="flex flex-col gap-stack-gap-sm">
                    <label className="font-label-bold text-label-bold text-on-surface">Loại hình <span className="text-error">*</span></label>
                    <select className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>TOÀN THỜI GIAN</option>
                      <option>BÁN THỜI GIAN</option>
                      <option>TỪ XA</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-stack-gap-sm">
                    <label className="font-label-bold text-label-bold text-on-surface">Lương tối thiểu (VND)</label>
                    <input type="number" placeholder="20000000" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" />
                  </div>
                  <div className="flex flex-col gap-stack-gap-sm">
                    <label className="font-label-bold text-label-bold text-on-surface">Lương tối đa (VND)</label>
                    <input type="number" placeholder="45000000" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" />
                  </div>
                </div>

                <div className="flex flex-col gap-stack-gap-sm">
                  <label className="font-label-bold text-label-bold text-on-surface">Mô tả công việc <span className="text-error">*</span></label>
                  <textarea rows={6} placeholder="Nhập mô tả chi tiết công việc..." className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all resize-y" required></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills */}
          {currentStep === 2 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Kỹ năng yêu cầu</h3>
                <button type="button" className="flex items-center space-x-1 font-label-bold text-label-bold text-primary hover:bg-primary-container/50 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm kỹ năng
                </button>
              </div>

              <div className="flex flex-col gap-stack-gap-md">
                {/* Mock Skill Item 1 */}
                <div className="flex items-center space-x-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                  <div className="flex-1">
                    <select className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>React</option>
                      <option>Node.js</option>
                      <option>TypeScript</option>
                    </select>
                  </div>
                  <div className="w-40">
                    <select className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>Bắt buộc</option>
                      <option>Ưu tiên</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <input type="number" placeholder="Số năm" defaultValue={2} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" />
                  </div>
                  <button type="button" className="p-2 text-outline-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>

                {/* Mock Skill Item 2 */}
                <div className="flex items-center space-x-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                  <div className="flex-1">
                    <select className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>TypeScript</option>
                      <option>React</option>
                      <option>Node.js</option>
                    </select>
                  </div>
                  <div className="w-40">
                    <select className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>Bắt buộc</option>
                      <option>Ưu tiên</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <input type="number" placeholder="Số năm" defaultValue={1} className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" />
                  </div>
                  <button type="button" className="p-2 text-outline-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-colors">
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
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Bộ lọc cứng</h3>
                <button type="button" className="flex items-center space-x-1 font-label-bold text-label-bold text-primary hover:bg-primary-container/50 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm bộ lọc
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Ứng viên không thỏa mãn các bộ lọc này sẽ tự động bị loại khi hệ thống chạy so khớp.</p>

              <div className="space-y-3 mt-4">
                <div className="flex items-center space-x-4 bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                  <div className="flex-1">
                    <select className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>GPA Tối thiểu</option>
                      <option>Năm kinh nghiệm tối thiểu</option>
                      <option>Bằng cấp bắt buộc</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <select className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all">
                      <option>{'>='}</option>
                      <option>{'=='}</option>
                      <option>{'<='}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input type="text" placeholder="Giá trị" defaultValue="3.0" className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all" />
                  </div>
                  <button type="button" className="p-2 text-outline-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="px-8 py-5 border-t border-surface-variant bg-surface-container-low flex justify-between items-center">
            <div>
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold rounded-lg hover:bg-surface-variant transition-colors shadow-sm"
                >
                  Quay lại
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleSaveDraft}
                  className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-bold text-label-bold rounded-lg hover:bg-surface-variant transition-colors shadow-sm"
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
                  className="px-6 py-2.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center"
                >
                  Tiếp theo
                  <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary text-on-primary font-label-bold text-label-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center disabled:opacity-50"
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
