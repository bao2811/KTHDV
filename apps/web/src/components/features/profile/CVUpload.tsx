'use client';

import { useRef } from 'react';

interface CVUploadProps {
  onUpload: (file: File) => Promise<any>;
  isUploading: boolean;
}

export default function CVUpload({ onUpload, isUploading }: CVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await onUpload(file);
    if (!result.success) {
      alert(result.message);
    } else {
      alert('Tải lên CV thành công!');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        disabled={isUploading}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-fixed-variant transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
        {isUploading ? 'Đang xử lý...' : 'Chọn tệp tải lên'}
      </button>
    </div>
  );
}
