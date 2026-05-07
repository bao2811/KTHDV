'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const mockResumes = [
  {
    id: 'cv-1',
    fileName: 'Nguyen_Van_A_Frontend_CV.pdf',
    fileType: 'PDF',
    uploadedAt: '2026-05-01',
    isPrimary: true,
  },
  {
    id: 'cv-2',
    fileName: 'Nguyen_Van_A_Resume_English.docx',
    fileType: 'DOCX',
    uploadedAt: '2026-04-15',
    isPrimary: false,
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý CV</h1>
        <p className="text-slate-500 mt-1">Tải lên các bản CV của bạn để sẵn sàng ứng tuyển.</p>
      </div>

      {/* Upload Zone */}
      <div 
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all bg-white ${
          isDragging ? 'border-[#3525cd] bg-indigo-50/50' : 'border-indigo-200 hover:border-[#3525cd]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-indigo-50 text-[#3525cd] rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">upload_file</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Tải lên CV mới</h3>
        <p className="text-slate-500 text-sm mb-4 text-center max-w-sm">
          Kéo thả file PDF/DOCX vào đây hoặc click để chọn file từ máy tính của bạn. Dung lượng tối đa 10MB.
        </p>
        <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-[#3525cd] hover:border-[#3525cd] transition-all shadow-sm">
          Chọn file
        </button>
      </div>

      {/* CV List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">CV đã tải lên ({resumes.length})</h2>
        
        {resumes.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-slate-100 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">find_in_page</span>
            <p className="text-slate-500">Chưa có CV nào được tải lên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {resume.fileType === 'PDF' ? (
                        <span className="material-symbols-outlined text-red-500 text-3xl">picture_as_pdf</span>
                      ) : (
                        <span className="material-symbols-outlined text-blue-500 text-3xl">description</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1" title={resume.fileName}>
                        {resume.fileName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          resume.fileType === 'PDF' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {resume.fileType}
                        </span>
                        <span className="text-xs text-slate-500">{resume.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    {resume.isPrimary ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#3525cd]/10 text-[#3525cd] text-xs font-medium rounded-full">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Mặc định</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSetPrimary(resume.id)}
                        className="text-xs font-medium text-slate-500 hover:text-[#3525cd] transition-colors"
                      >
                        Đặt làm mặc định
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-[#3525cd] hover:bg-indigo-50 rounded-md transition-colors" title="Tải về">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(resume.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                      title="Xóa"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
