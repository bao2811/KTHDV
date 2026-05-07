'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const mockPendingJobs = [
  {
    id: 'job-3',
    title: 'Product Manager',
    company: 'InnoTech',
    requester: 'Nguyen Van HR',
    requestedAt: '2026-05-06 14:30',
    type: 'FULL_TIME',
    salary: '30M - 60M VND',
  },
  {
    id: 'job-6',
    title: 'Senior DevOps Engineer',
    company: 'CloudCorp',
    requester: 'Tran Thi Manager',
    requestedAt: '2026-05-07 09:15',
    type: 'REMOTE',
    salary: '40M - 80M VND',
  }
];

export default function HRJobsApprovals() {
  const [pendingJobs, setPendingJobs] = useState(mockPendingJobs);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');

  const handleOpenModal = (jobId: string, type: 'APPROVE' | 'REJECT') => {
    setSelectedJob(jobId);
    setActionType(type);
    setComment('');
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedJob) return;
    
    // Call API here in real app
    setPendingJobs(pendingJobs.filter(job => job.id !== selectedJob));
    setIsModalOpen(false);
    
    // Simulate toast
    alert(`Đã ${actionType === 'APPROVE' ? 'duyệt' : 'từ chối'} tin tuyển dụng thành công!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Duyệt tin tuyển dụng</h1>
        <p className="text-slate-500 mt-1">Quản lý và phê duyệt các tin tuyển dụng đang chờ đăng.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {pendingJobs.length === 0 ? (
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
                {pendingJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-lg">{job.title}</div>
                      <div className="text-sm text-slate-500 mt-1 flex items-center space-x-3">
                        <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">business</span> {job.company}</span>
                        <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">work</span> {job.type}</span>
                        <span className="flex items-center"><span className="material-symbols-outlined text-[16px] mr-1">payments</span> {job.salary}</span>
                      </div>
                      <div className="mt-3">
                        <button className="text-sm font-medium text-[#3525cd] hover:underline flex items-center">
                          <span className="material-symbols-outlined text-[16px] mr-1">visibility</span>
                          Xem trước nội dung tin
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                          {job.requester.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{job.requester}</div>
                          <div className="text-xs text-slate-500">{job.requestedAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenModal(job.id, 'APPROVE')}
                          className="px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center"
                        >
                          <span className="material-symbols-outlined text-[18px] mr-1">check_circle</span>
                          Duyệt
                        </button>
                        <button 
                          onClick={() => handleOpenModal(job.id, 'REJECT')}
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actionType === 'APPROVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <span className="material-symbols-outlined">
                  {actionType === 'APPROVE' ? 'check_circle' : 'warning'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {actionType === 'APPROVE' ? 'Duyệt tin tuyển dụng' : 'Từ chối tin tuyển dụng'}
              </h2>
            </div>
            
            <p className="text-slate-600 text-sm mb-4">
              Bạn đang thực hiện thao tác <strong className={actionType === 'APPROVE' ? 'text-green-600' : 'text-red-600'}>{actionType === 'APPROVE' ? 'DUYỆT' : 'TỪ CHỐI'}</strong> cho tin tuyển dụng này. 
              Tin sẽ chuyển sang trạng thái tương ứng.
            </p>

            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-slate-700">Lý do / Ghi chú (Không bắt buộc)</label>
              <textarea 
                rows={3} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập ghi chú hoặc lý do từ chối..." 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3525cd]/20 focus:border-[#3525cd] transition-colors"
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
                  actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
