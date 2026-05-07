'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const mockResumes = [
  {
    id: 'cv-1',
    fileName: 'Nguyen_Van_A_Frontend_CV_Tiếng_Việt.pdf',
    fileType: 'PDF',
    uploadedAt: '24 Thg 10, 2025',
    isPrimary: true,
    size: '1.2 MB'
  },
  {
    id: 'cv-2',
    fileName: 'Nguyen_Van_A_CV_Tiếng_Anh.docx',
    fileType: 'DOCX',
    uploadedAt: '15 Thg 09, 2025',
    isPrimary: false,
    size: '850 KB'
  },
];

export default function CandidateResumes() {
  const [resumes, setResumes] = useState(mockResumes);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In real app, we would process e.dataTransfer.files here
    alert('Mock: Đã nhận file upload (Chức năng đang phát triển)');
  };

  const handleSetPrimary = (id: string) => {
    setResumes(resumes.map(r => ({ ...r, isPrimary: r.id === id })));
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa CV này không?')) {
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-container-padding max-w-7xl mx-auto w-full space-y-stack-gap-lg">
      
      {/* Header */}
      <div>
        <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">CV của tôi</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Quản lý và cập nhật các bản CV để tối ưu cơ hội nghề nghiệp.</p>
      </div>

      {/* Upload Zone */}
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-300 group overflow-hidden ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
          isDragging ? 'bg-primary text-on-primary scale-110' : 'bg-primary/10 text-primary group-hover:scale-110'
        }`}>
          <span className="material-symbols-outlined text-[40px] font-variation-fill">cloud_upload</span>
        </div>
        <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">Tải lên CV mới</h3>
        <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md mb-6">
          Kéo thả file <span className="font-bold text-primary">PDF</span> hoặc <span className="font-bold text-primary">DOCX</span> vào đây.
          <br />Dung lượng tối đa 10MB.
        </p>
        <button className="px-8 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Chọn file từ máy tính
        </button>
        
        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700"></div>
      </div>

      {/* CV List Section */}
      <div className="space-y-stack-gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Bản CV hiện có ({resumes.length})</h3>
          <span className="text-on-surface-variant font-body-sm text-body-sm">Cập nhật lần cuối: Hôm nay</span>
        </div>
        
        {resumes.length === 0 ? (
          <div className="bg-surface-container-lowest p-16 rounded-2xl border border-surface-variant/50 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4 opacity-50">
              <span className="material-symbols-outlined text-[48px] text-outline">description</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Chưa có CV nào được tải lên.</p>
            <button className="mt-4 text-primary font-label-bold text-label-bold hover:underline">Bắt đầu tải lên</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grid-gutter">
            {resumes.map((resume) => (
              <div 
                key={resume.id} 
                className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient-card border border-surface-variant/50 hover:border-primary/30 transition-all group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6 ${
                    resume.fileType === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <span className="material-symbols-outlined text-[32px] font-variation-fill">
                      {resume.fileType === 'PDF' ? 'picture_as_pdf' : 'description'}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-outline hover:text-error transition-colors"
                      title="Xóa"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-body-md text-body-md font-bold text-on-surface line-clamp-1 mb-1" title={resume.fileName}>
                    {resume.fileName}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                      resume.fileType === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {resume.fileType}
                    </span>
                    <span className="text-on-surface-variant font-label-bold text-[11px] uppercase opacity-70">
                      {resume.size} • {resume.uploadedAt}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-variant/50 flex items-center justify-between">
                  {resume.isPrimary ? (
                    <div className="flex items-center gap-1.5 text-primary">
                      <span className="material-symbols-outlined text-[18px] font-variation-fill">verified</span>
                      <span className="font-label-bold text-label-bold">CV chính</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleSetPrimary(resume.id)}
                      className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Đặt làm mặc định
                    </button>
                  )}
                  <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Download">
                    <span className="material-symbols-outlined text-[22px]">download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className="bg-surface-container-high rounded-2xl p-6 flex items-start gap-4 border border-surface-variant/30">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">lightbulb</span>
        </div>
        <div>
          <h4 className="font-body-md text-body-md font-bold text-on-surface">Mẹo nhỏ cho bạn</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
            Sử dụng CV định dạng PDF để đảm bảo định dạng của bạn không bị thay đổi khi nhà tuyển dụng xem trên các thiết bị khác nhau. Đừng quên đặt CV hoàn thiện nhất làm mặc định để ứng tuyển nhanh chóng hơn!
          </p>
        </div>
      </div>
    </div>
  );
}
