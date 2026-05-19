'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';

type ReferralRow = {
  id: number;
  status: 'PENDING' | 'VERIFIED' | 'SUSPICIOUS' | 'EXPIRED';
  sentAt: string;
  respondedAt?: string | null;
  referrer: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    resume?: {
      user?: {
        email: string;
        profile?: { fullName?: string | null } | null;
        candidateProfile?: { fullName?: string | null; title?: string | null } | null;
      };
    };
  };
};

const statusLabels: Record<ReferralRow['status'], string> = {
  PENDING: 'Chờ xác minh',
  VERIFIED: 'Đã xác minh',
  SUSPICIOUS: 'Nghi ngờ',
  EXPIRED: 'Hết hạn',
};

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({ page: 1, limit: 50, status: statusFilter || undefined }),
    [statusFilter],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminService
      .getReferrals(params)
      .then((response) => {
        if (!mounted) return;
        setReferrals(response.data as ReferralRow[]);
        setError('');
      })
      .catch(() => {
        if (mounted) setError('Không tải được danh sách referral.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  const updateReferral = async (id: number, status: ReferralRow['status']) => {
    const previous = referrals;
    setReferrals((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    try {
      await adminService.verifyReferral(id, { status });
    } catch {
      setReferrals(previous);
      setError('Cập nhật referral thất bại.');
    }
  };

  const summary = {
    pending: referrals.filter((item) => item.status === 'PENDING').length,
    verified: referrals.filter((item) => item.status === 'VERIFIED').length,
    suspicious: referrals.filter((item) => item.status === 'SUSPICIOUS').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý referral</h1>
          <p className="text-sm text-slate-500">Theo dõi và cập nhật trạng thái xác minh người tham chiếu.</p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Chờ xác minh</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.pending}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Đã xác minh</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.verified}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Nghi ngờ</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.suspicious}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Mã</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Người tham chiếu</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Ứng viên</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Gửi lúc</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">Đang tải referral...</td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">Chưa có referral.</td>
                </tr>
              ) : (
                referrals.map((referral) => {
                  const candidate = referral.referrer.resume?.user;
                  const candidateName =
                    candidate?.candidateProfile?.fullName || candidate?.profile?.fullName || candidate?.email || '-';

                  return (
                    <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">#{referral.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{referral.referrer.name || '-'}</div>
                        <div className="text-xs text-slate-500">{referral.referrer.email || referral.referrer.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{candidateName}</div>
                        <div className="text-xs text-slate-500">{candidate?.candidateProfile?.title || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(referral.sentAt))}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {statusLabels[referral.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateReferral(referral.id, 'VERIFIED')}
                            className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                          >
                            Xác minh
                          </button>
                          <button
                            onClick={() => updateReferral(referral.id, 'SUSPICIOUS')}
                            className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100"
                          >
                            Nghi ngờ
                          </button>
                          <button
                            onClick={() => updateReferral(referral.id, 'EXPIRED')}
                            className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                          >
                            Hết hạn
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
