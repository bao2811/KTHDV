'use client';

import { useEffect, useMemo, useState } from 'react';
import { APPLICATION_STATUS } from '@/constants';
import { adminService } from '@/services/admin.service';
import type { Application, Job } from '@/types';

const statusLabels: Record<string, string> = {
  SUBMITTED: 'Đã nộp',
  MATCHED: 'Đã so khớp',
  INTERVIEWING: 'Phỏng vấn',
  OFFERED: 'Đề nghị',
  REJECTED: 'Từ chối',
};

const statusClasses: Record<string, string> = {
  SUBMITTED: 'bg-slate-100 text-slate-700',
  MATCHED: 'bg-blue-100 text-blue-700',
  INTERVIEWING: 'bg-amber-100 text-amber-700',
  OFFERED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const normalizeList = <T,>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  return response?.data || [];
};

const candidateName = (application: Application) =>
  application.candidate?.fullName ||
  application.candidate?.profile?.fullName ||
  application.candidate?.email ||
  `Candidate #${application.candidateId}`;

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({
      page: 1,
      limit: 100,
      status: statusFilter || undefined,
      jobId: jobFilter ? Number(jobFilter) : undefined,
    }),
    [jobFilter, statusFilter],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([adminService.getAllApplications(params), adminService.getAllJobs({ page: 1, limit: 100 })])
      .then(([applicationResponse, jobResponse]) => {
        if (!mounted) return;
        setApplications(normalizeList<Application>(applicationResponse));
        setJobs(normalizeList<Job>(jobResponse));
        setError('');
      })
      .catch(() => {
        if (mounted) setError('Không tải được danh sách ứng tuyển.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  const updateStatus = async (application: Application, status: Application['status']) => {
    const previous = applications;
    setSavingId(application.id);
    setApplications((items) =>
      items.map((item) => (item.id === application.id ? { ...item, status } : item)),
    );

    try {
      const updated = await adminService.updateApplicationStatus(application.id, status);
      setApplications((items) => items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      setError('');
    } catch {
      setApplications(previous);
      setError('Cập nhật trạng thái ứng tuyển thất bại.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý ứng tuyển</h1>
        <p className="text-sm text-slate-500">Xem tất cả đơn ứng tuyển và cập nhật trạng thái xử lý.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 p-4 md:grid-cols-[220px_1fr]">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="">Tất cả trạng thái</option>
            {Object.values(APPLICATION_STATUS).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
          <select value={jobFilter} onChange={(event) => setJobFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="">Tất cả tin tuyển dụng</option>
            {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Ứng viên</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Tin tuyển dụng</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Công ty</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">CV</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Match</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Ngày nộp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Đang tải ứng tuyển...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Không có ứng tuyển phù hợp.</td></tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{candidateName(application)}</div>
                      <div className="mt-1 text-xs text-slate-500">#{application.id}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{application.job?.title || `Job #${application.jobId}`}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{application.job?.company?.name || '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{application.resume?.fileName || '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {typeof application.matchResult?.overallScore === 'number'
                        ? `${Math.round(application.matchResult.overallScore * 100)}%`
                        : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[application.status]}`}>
                          {statusLabels[application.status]}
                        </span>
                        <select value={application.status} disabled={savingId === application.id} onChange={(event) => updateStatus(application, event.target.value as Application['status'])} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60">
                          {Object.values(APPLICATION_STATUS).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {new Intl.DateTimeFormat('vi-VN').format(new Date(application.appliedAt))}
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
