'use client';

import { useState, useEffect } from 'react';
import { jobService } from '@/services/job.service';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function HRJobsApprovals() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await jobService.getPendingApprovals();
      setApprovals(data);
    } catch (err) {
      console.error('Failed to fetch approvals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleOpenModal = (approval: any, type: 'APPROVED' | 'REJECTED') => {
    setSelectedApproval(approval);
    setActionType(type);
    setComment('');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApproval) return;
    
    try {
      await jobService.approveJob(selectedApproval.jobId, selectedApproval.id, {
        status: actionType,
        comment: comment
      });
      
      setIsModalOpen(false);
      fetchApprovals();
      alert(`Đã ${actionType === 'APPROVED' ? 'duyệt' : 'từ chối'} tin tuyển dụng thành công!`);
    } catch (err) {
      alert('Xử lý phê duyệt thất bại');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Duyệt tin tuyển dụng</h1>
          <p className="text-slate-500 mt-1">Quản lý và phê duyệt các tin tuyển dụng đang chờ đăng.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : approvals.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-green-300 mb-3">task_alt</span>
              <h3 className="text-lg font-bold text-slate-900">Không có tin nào chờ duyệt</h3>
              <p className="text-slate-500 mt-1">Tuyệt vời! Tất cả các tin đã được xử lý.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="px-6 py-4 font-medium">Tin tuyển dụng</th>
                    <th className="px-6 py-4 font-medium">Người yêu cầu</th>
                    <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approvals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-lg">{approval.job?.title}</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center space-x-3">
                          <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">business</span> {approval.job?.company?.name}</span>
                          <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">work</span> {approval.job?.jobType}</span>
                          <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">payments</span> {approval.job?.salaryMin} - {approval.job?.salaryMax}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {approval.job?.createdBy?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{approval.job?.createdBy?.email}</div>
                            <div className="text-xs text-slate-500">{new Date(approval.job?.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleOpenModal(approval, 'APPROVED')}
                            className="px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center"
                          >
                            <span className="material-symbols-outlined text-[18px] mr-1">check_circle</span>
                            Duyệt
                          </button>
                          <button 
                            onClick={() => handleOpenModal(approval, 'REJECTED')}
                            className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center"
                          >
                            <span className="material-symbols-outlined text-[18px] mr-1">cancel</span>
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
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actionType === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <span className="material-symbols-outlined">
                    {actionType === 'APPROVED' ? 'check_circle' : 'warning'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {actionType === 'APPROVED' ? 'Duyệt tin tuyển dụng' : 'Từ chối tin tuyển dụng'}
                </h2>
              </div>
              
              <p className="text-slate-600 text-sm mb-4">
                Bạn đang thực hiện thao tác <strong className={actionType === 'APPROVED' ? 'text-green-600' : 'text-red-600'}>{actionType === 'APPROVED' ? 'DUYỆT' : 'TỪ CHỐI'}</strong> cho tin tuyển dụng này. 
                Tin sẽ chuyển sang trạng thái tương ứng.
              </p>

              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-slate-700">Lý do / Ghi chú (Không bắt buộc)</label>
                <textarea 
                  rows={3} 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập ghi chú hoặc lý do từ chối..." 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleConfirmAction}
                  className={`px-6 py-2 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center ${
                    actionType === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
