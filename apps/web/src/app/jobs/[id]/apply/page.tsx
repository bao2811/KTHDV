'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_JOB_INFO = {
  id: 'job-1',
  title: 'Senior Frontend Developer (React/Next.js)',
  companyName: 'NexusTech',
  location: 'Hồ Chí Minh',
};

const MOCK_CVS = [
  { id: 'cv-1', fileName: 'Nguyen_Van_A_Frontend_CV.pdf', isPrimary: true },
  { id: 'cv-2', fileName: 'Nguyen_Van_A_Resume_English.docx', isPrimary: false },
];

export default function ApplyJobPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedCv, setSelectedCv] = useState(MOCK_CVS.find(cv => cv.isPrimary)?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Ứng tuyển thành công!');
      router.push('/candidate/applications');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={`/jobs/${params.id}`} className="text-sm font-medium text-slate-500 hover:text-primary flex items-center">
            <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
            Quay lại chi tiết công việc
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-white px-8 py-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Đơn ứng tuyển</h1>
            <div className="bg-white p-4 rounded-xl border border-slate-100 mt-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 text-primary rounded-lg flex items-center justify-center font-bold text-xl">
                {MOCK_JOB_INFO.companyName.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{MOCK_JOB_INFO.title}</h2>
                <p className="text-sm text-slate-500">{MOCK_JOB_INFO.companyName} • {MOCK_JOB_INFO.location}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <span className="material-symbols-outlined text-primary mr-2">description</span>
                Chọn CV của bạn
              </h3>
              
              <div className="space-y-3">
                {MOCK_CVS.map((cv) => (
                  <label 
                    key={cv.id} 
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                      selectedCv === cv.id 
                        ? 'border-primary bg-indigo-50/30' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="cv" 
                      value={cv.id}
                      checked={selectedCv === cv.id}
                      onChange={(e) => setSelectedCv(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    />
                    <div className="ml-3 flex-1 flex justify-between items-center">
                      <span className="font-medium text-slate-900">{cv.fileName}</span>
                      {cv.isPrimary && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full uppercase">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <Link href="/candidate/resumes" className="text-sm text-primary font-medium hover:underline flex items-center">
                  <span className="material-symbols-outlined text-[16px] mr-1">add_circle</span>
                  Tải lên CV mới
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
              <button 
                type="button" 
                onClick={() => router.back()}
                className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                disabled={!selectedCv || isSubmitting}
                className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px] mr-2">refresh</span>
                    Đang gửi...
                  </>
                ) : (
                  'Nộp đơn ứng tuyển'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
