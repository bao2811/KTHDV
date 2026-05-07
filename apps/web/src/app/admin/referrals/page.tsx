'use client';

import { useState } from 'react';

// --- MOCK DATA ---
const mockReferrals = [
  { id: 'ref-1', referrerName: 'Nguyễn Văn A', candidateName: 'Trần Thị B', jobTitle: 'Senior Frontend', status: 'PENDING_VERIFICATION', date: '08/05/2026', bonus: '5,000,000 VNĐ' },
  { id: 'ref-2', referrerName: 'Lê Văn C', candidateName: 'Phạm Văn D', jobTitle: 'Backend Engineer', status: 'REWARDED', date: '01/05/2026', bonus: '10,000,000 VNĐ' },
  { id: 'ref-3', referrerName: 'Nguyễn Văn A', candidateName: 'Lý Tiểu E', jobTitle: 'UI/UX Designer', status: 'REJECTED', date: '15/04/2026', bonus: '2,000,000 VNĐ' },
];

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState(mockReferrals);

  const handleVerify = (id: string, newStatus: string) => {
    setReferrals(referrals.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý Giới thiệu (Referrals)</h1>
        <p className="text-slate-500 mt-1">Duyệt và trao thưởng cho các lượt giới thiệu thành công.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full mr-4">
            <span className="material-symbols-outlined text-[28px]">pending_actions</span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-bold">Chờ duyệt</h3>
            <p className="text-2xl font-black text-slate-900">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-green-50 text-green-600 rounded-full mr-4">
            <span className="material-symbols-outlined text-[28px]">payments</span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-bold">Đã trao thưởng</h3>
            <p className="text-2xl font-black text-slate-900">45</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full mr-4">
            <span className="material-symbols-outlined text-[28px]">account_balance_wallet</span>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-bold">Tổng chi phí</h3>
            <p className="text-2xl font-black text-slate-900">240Tr VNĐ</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Mã giới thiệu</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Người giới thiệu</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Ứng viên & Vị trí</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Ngày giới thiệu</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Tiền thưởng</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="py-4 px-6 text-sm font-bold text-slate-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm text-slate-500">{ref.id}</td>
                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">{ref.referrerName}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{ref.candidateName}</span>
                      <span className="text-xs text-slate-500">{ref.jobTitle}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{ref.date}</td>
                  <td className="py-4 px-6 text-sm font-bold text-green-600">{ref.bonus}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      ref.status === 'REWARDED' ? 'bg-green-100 text-green-700' :
                      ref.status === 'PENDING_VERIFICATION' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {ref.status === 'REWARDED' ? 'Đã thưởng' : 
                       ref.status === 'PENDING_VERIFICATION' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {ref.status === 'PENDING_VERIFICATION' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleVerify(ref.id, 'REWARDED')}
                          className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 font-bold text-xs rounded-md transition-colors"
                        >
                          Duyệt thưởng
                        </button>
                        <button 
                          onClick={() => handleVerify(ref.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-md transition-colors"
                        >
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Đã xử lý</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
