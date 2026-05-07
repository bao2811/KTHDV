'use client';

import { useState, useEffect } from 'react';
import { candidateService } from '@/services/candidate.service';
import Button from '@/components/ui/Button';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profileId: number;
  experience?: any; // If provided, we are editing
}

export default function ExperienceModal({ isOpen, onClose, onSuccess, profileId, experience }: ExperienceModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        companyName: experience.companyName || '',
        position: experience.position || '',
        startDate: experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : '',
        endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
        description: experience.description || '',
      });
    } else {
      setFormData({
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      });
    }
  }, [experience, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (experience) {
        await candidateService.updateExperience(experience.id, formData);
      } else {
        await candidateService.addExperience(profileId, formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save experience', error);
      alert('Lưu thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experience || !confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này?')) return;
    try {
      setLoading(true);
      await candidateService.deleteExperience(experience.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete experience', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface">
            {experience ? 'Sửa kinh nghiệm' : 'Thêm kinh nghiệm'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Tên công ty</label>
            <input
              type="text"
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Vị trí / Chức danh</label>
            <input
              type="text"
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface-variant">Ngày bắt đầu</label>
              <input
                type="date"
                className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface-variant">Ngày kết thúc</label>
              <input
                type="date"
                className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <p className="text-[10px] text-outline text-right">Để trống nếu đang làm việc</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Mô tả công việc</label>
            <textarea
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            {experience && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-error font-bold text-sm hover:underline"
              >
                Xóa mục này
              </button>
            )}
            <div className="flex gap-3 ml-auto">
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
                Lưu
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
