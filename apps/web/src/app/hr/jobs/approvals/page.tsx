'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/job.service';
import { Job } from '@/types';
import { JOB_TYPE_LABELS } from '@/constants';

export default function HRJobsApprovals() {
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs({ status: 'PENDING' });
      const data = Array.isArray(response) ? response : (response as any).data || [];
      setPendingJobs(data);
    } catch (err) {
      console.error('Failed to fetch pending jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleOpenModal = (jobId: number, type: 'APPROVE' | 'REJECT') => {
    setSelectedJobId(jobId);
    setActionType(type);
    setComment('');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedJobId === null) return;
    
    try {
      setIsSubmitting(true);
      const newStatus = actionType === 'APPROVE' ? 'ACTIVE' : 'REJECTED';
      
      await jobService.updateJob(selectedJobId, { 
        status: newStatus,
        approvalComment: comment || undefined 
      });

      setPendingJobs(prev => prev.filter(job => job.id !== selectedJobId));
      setIsModalOpen(false);
      alert(`Đã ${actionType === 'APPROVE' ? 'duyệt' : 'từ chối'} tin tuyển dụng thành công!`);
    } catch (err: any) {
      alert('Thao tác thất bại: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.floor(n / 1000000)) + 'Tr';
    if (min && max) return `${fmt(min)} - ${fmt(max)} VNĐ`;
    if (min) return `Từ ${fmt(min)} VNĐ`;
    return `Đến ${fmt(max!)} VNĐ`;
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-bold text-label-bold uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[14px]">fact_check</span>
            Hệ thống phê duyệt
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">Duyệt tin tuyển dụng</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quản lý và phê duyệt các tin tuyển dụng đang chờ đăng.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/30 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : pendingJobs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">task_alt</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">Không có tin nào chờ duyệt</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Tuyệt vời! Tất cả các tin đã được xử lý xong.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-bold text-[11px] uppercase tracking-wider border-b border-outline-variant/30">
                  <th className="px-6 py-4 font-semibold">Tin tuyển dụng</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {pendingJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <Link href={`/hr/jobs/${job.id}`} className="font-headline-lg text-headline-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                          {job.title}
                        </Link>
                        <div className="flex flex-wrap gap-4 text-body-sm text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">business</span> 
                            {job.company?.name || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">work</span> 
                            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">payments</span> 
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                        </div>
                        <div className="mt-2 text-[11px] text-outline font-label-bold uppercase">
                          Gửi lúc: {new Date(job.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleOpenModal(job.id, 'APPROVE')}
                          className="px-5 py-2 bg-green-600 text-white font-label-bold text-label-bold rounded-xl hover:bg-green-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Duyệt
                        </button>
                        <button 
                          onClick={() => handleOpenModal(job.id, 'REJECT')}
                          className="px-5 py-2 bg-error text-white font-label-bold text-label-bold rounded-xl hover:bg-error-container hover:text-on-error-container transition-all shadow-sm active:scale-95 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${actionType === 'APPROVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <span className="material-symbols-outlined text-[28px]">
                  {actionType === 'APPROVE' ? 'check_circle' : 'warning'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-on-surface">
                {actionType === 'APPROVE' ? 'Xác nhận duyệt tin' : 'Từ chối tin này'}
              </h2>
            </div>
            
            <p className="text-on-surface-variant text-body-md mb-6 leading-relaxed">
              Bạn đang thực hiện thao tác <strong className={actionType === 'APPROVE' ? 'text-green-600' : 'text-red-600'}>{actionType === 'APPROVE' ? 'CHẤP THUẬN' : 'TỪ CHỐI'}</strong>. 
              Hành động này sẽ cập nhật trạng thái của tin tuyển dụng ngay lập tức.
            </p>

            <div className="space-y-2 mb-8">
              <label className="block text-sm font-bold text-on-surface">Ghi chú (Tùy chọn)</label>
              <textarea 
                rows={3} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập phản hồi cho người yêu cầu..." 
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-sm resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-surface-container border border-outline-variant text-on-surface font-label-bold rounded-xl hover:bg-surface-variant transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className={`px-8 py-2.5 text-white font-label-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                  actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-error hover:bg-error-container hover:text-on-error-container'
                }`}
              >
                {isSubmitting && <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
