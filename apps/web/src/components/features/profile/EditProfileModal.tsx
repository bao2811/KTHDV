'use client';

import { useState, useEffect } from 'react';
import { candidateService } from '@/services/candidate.service';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profile: any;
}

export default function EditProfileModal({ isOpen, onClose, onSuccess, profile }: EditProfileModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    phone: '',
    summary: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        fullName: profile.fullName || '',
        title: profile.title || '',
        phone: profile.phone || '',
        summary: profile.summary || '',
      });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await candidateService.updateProfile(user.id, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Cập nhật thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface">Chỉnh sửa hồ sơ</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Họ và tên</label>
            <input
              type="text"
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Chức danh / Vị trí</label>
            <input
              type="text"
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
              placeholder="VD: Kỹ sư Frontend, Nhân viên kinh doanh..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Số điện thoại</label>
            <input
              type="tel"
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Giới thiệu bản thân</label>
            <textarea
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all min-h-[120px] resize-none"
              placeholder="Chia sẻ ngắn gọn về kinh nghiệm và mục tiêu của bạn..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-bold text-on-surface-variant hover:bg-surface-variant transition-all"
            >
              Hủy
            </button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="px-8"
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
