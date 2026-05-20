'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { Interview } from '@/types';

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Đã lên lịch',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const statusClasses: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const normalizeList = <T,>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  return response?.data || [];
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));

const candidateName = (interview: Interview) =>
  interview.application?.candidate?.fullName ||
  interview.application?.candidate?.profile?.fullName ||
  interview.application?.candidate?.email ||
  `Application #${interview.applicationId}`;

const interviewerName = (interview: Interview) =>
  interview.interviewer?.fullName ||
  interview.interviewer?.profile?.fullName ||
  interview.interviewer?.email ||
  `User #${interview.interviewerId}`;

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({
      page: 1,
      limit: 100,
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [endDate, startDate, statusFilter],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    adminService
      .getAllInterviews(params)
      .then((response) => {
        if (!mounted) return;
        let data = normalizeList<Interview>(response);
        if (startDate) data = data.filter((item) => new Date(item.scheduledAt) >= new Date(startDate));
        if (endDate) data = data.filter((item) => new Date(item.scheduledAt) <= new Date(`${endDate}T23:59:59`));
        setInterviews(data);
        setError('');
      })
      .catch(() => {
        if (mounted) setError('Không tải được danh sách phỏng vấn.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params, startDate, endDate]);

  const cancelInterview = async (interview: Interview) => {
    if (!window.confirm(`Hủy lịch phỏng vấn #${interview.id}?`)) return;

    setSavingId(interview.id);
    try {
      await adminService.cancelInterview(interview.id);
      setInterviews((items) => items.filter((item) => item.id !== interview.id));
      setError('');
    } catch {
      setError('Hủy lịch phỏng vấn thất bại.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý phỏng vấn</h1>
        <p className="text-sm text-slate-500">Theo dõi toàn bộ lịch phỏng vấn và hủy lịch khi cần.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Ứng viên</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Tin tuyển dụng</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Interviewer</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Thời gian</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Hình thức</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="px-5 py-3 text-right text-sm font-bold text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Đang tải lịch phỏng vấn...</td></tr>
              ) : interviews.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Không có lịch phỏng vấn phù hợp.</td></tr>
              ) : (
                interviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{candidateName(interview)}</div>
                      <div className="mt-1 text-xs text-slate-500">Application #{interview.applicationId}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{interview.application?.job?.title || '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{interviewerName(interview)}</td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-slate-900">{formatDateTime(interview.scheduledAt)}</div>
                      <div className="mt-1 text-xs text-slate-500">{interview.durationMinutes} phút</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {interview.interviewType === 'ONLINE' ? 'Online' : 'Trực tiếp'}
                      {interview.meetingLink && (
                        <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700">
                          Link
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[interview.status]}`}>
                        {statusLabels[interview.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button onClick={() => cancelInterview(interview)} disabled={savingId === interview.id || interview.status === 'CANCELLED'} className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60">
                          Hủy lịch
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
