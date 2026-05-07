'use client';

interface CVItemProps {
  cv: any;
  onDelete: (id: number) => void;
  onSetPrimary: (id: number) => void;
  onDownload: (id: number) => void;
}

export default function CVItem({ cv, onDelete, onSetPrimary, onDownload }: CVItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        cv.isPrimary 
          ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
          : 'border-surface-variant/50 hover:bg-surface-container'
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
        cv.isPrimary ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
      }`}>
        <span className="material-symbols-outlined text-[28px]">description</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h5 className="font-bold text-on-surface truncate">
            {cv.fileName || 'Untitled CV'}
          </h5>
          {cv.isPrimary && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider">
              Mặc định
            </span>
          )}
        </div>
        <p className="text-on-surface-variant text-xs mt-1">
          Đã tải lên: {new Date(cv.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onDownload(cv.id)}
          className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant"
          title="Xem/Tải xuống"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
        {!cv.isPrimary && (
          <button
            onClick={() => onSetPrimary(cv.id)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
            title="Đặt làm mặc định"
          >
            <span className="material-symbols-outlined text-[20px]">star</span>
          </button>
        )}
        <button
          onClick={() => onDelete(cv.id)}
          className="p-2 hover:bg-error/10 rounded-full transition-colors text-error"
          title="Xóa"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
}
