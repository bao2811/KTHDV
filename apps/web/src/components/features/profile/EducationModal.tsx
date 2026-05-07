'use client';

import { useState, useEffect } from 'react';
import { candidateService } from '@/services/candidate.service';
import Button from '@/components/ui/Button';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profileId: number;
  education?: any;
}

export default function EducationModal({ isOpen, onClose, onSuccess, profileId, education }: EducationModalProps) {
  const [formData, setFormData] = useState({
    schoolName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (education) {
      setFormData({
        schoolName: education.schoolName || '',
        degree: education.degree || '',
        major: education.major || '',
        startDate: education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : '',
        endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        schoolName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [education, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (education) {
        await candidateService.updateEducation(education.id, formData);
      } else {
        await candidateService.addEducation(profileId, formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save education', error);
      alert('Lưu thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!education || !confirm('Bạn có chắc chắn muốn xóa mục học vấn này?')) return;
    try {
      setLoading(true);
      await candidateService.deleteEducation(education.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to delete education', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface">
            {education ? 'Sửa học vấn' : 'Thêm học vấn'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-on-surface-variant">Tên trường</label>
            <input
              type="text"
              className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface-variant">Bằng cấp</label>
              <input
                type="text"
                className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
                placeholder="VD: Cử nhân, Thạc sĩ..."
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface-variant">Chuyên ngành</label>
              <input
                type="text"
                className="px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary transition-all"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              />
            </div>
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
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            {education && (
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
