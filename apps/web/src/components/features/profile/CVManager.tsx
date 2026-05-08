'use client';

import { useResumes } from '@/hooks/useResumes';
import CVItem from './CVItem';
import CVUpload from './CVUpload';

export default function CVManager() {
  const { 
    resumes, 
    loading, 
    isUploading, 
    uploadResume, 
    deleteResume, 
    setPrimaryResume, 
    viewResume 
  } = useResumes();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Actions & Info */}
      <div className="lg:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
        {/* Upload Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-variant/50">
          <h4 className="font-bold text-on-surface mb-2">Tải lên CV</h4>
          <p className="text-on-surface-variant text-xs mb-6">Chọn bản CV mới nhất để thu hút nhà tuyển dụng.</p>
          <CVUpload onUpload={uploadResume} isUploading={isUploading} />
        </div>

        {/* Info Card - Smaller */}
        <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary-container/30 flex gap-3">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">info</span>
          <div className="flex flex-col gap-1">
            <h6 className="font-bold text-on-secondary-container text-xs">Lưu ý</h6>
            <p className="text-[11px] text-on-secondary-container/70 leading-relaxed">
              Hỗ trợ <strong>PDF, DOC, DOCX</strong>. Bản <strong>Mặc định</strong> sẽ được dùng để ứng tuyển nhanh.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: CV List - Larger */}
      <div className="lg:col-span-8 flex flex-col gap-4 order-1 lg:order-2">
        <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-sm border border-surface-variant/50 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">Danh sách CV</h4>
              <p className="text-on-surface-variant text-sm mt-1">Danh sách hồ sơ của bạn</p>
            </div>
            <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-on-surface-variant">
              {resumes.length} bản ghi
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-on-surface-variant text-sm">Đang tải...</p>
              </div>
            ) : resumes.length > 0 ? (
              resumes.map((cv) => (
                <CVItem
                  key={cv.id}
                  cv={cv}
                  onDelete={deleteResume}
                  onSetPrimary={setPrimaryResume}
                  onDownload={viewResume}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-surface-container/20 rounded-2xl border-2 border-dashed border-outline-variant">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-outline-variant text-3xl">upload_file</span>
                </div>
                <p className="text-on-surface-variant font-medium">Chưa có CV nào</p>
                <p className="text-on-surface-variant text-xs mt-1">Bắt đầu bằng cách tải lên CV đầu tiên của bạn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

