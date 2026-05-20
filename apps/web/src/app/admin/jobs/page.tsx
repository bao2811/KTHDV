'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { Company, Job, JobCategory } from '@/types';

const jobStatusLabels: Record<string, string> = {
  DRAFT: 'Bản nháp',
  PENDING: 'Chờ duyệt',
  ACTIVE: 'Đang mở',
  CLOSED: 'Đã đóng',
  EXPIRED: 'Hết hạn',
};

const jobStatusClasses: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  PENDING: 'bg-amber-100 text-amber-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-zinc-100 text-zinc-700',
};

const normalizeList = <T,>(response: any): T[] => {
  if (Array.isArray(response)) return response;
  return response?.data || [];
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('vi-VN').format(new Date(value));
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const params = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      companyId: companyFilter ? Number(companyFilter) : undefined,
      categoryId: categoryFilter ? Number(categoryFilter) : undefined,
    }),
    [categoryFilter, companyFilter, searchTerm, statusFilter],
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      adminService.getAllJobs(params),
      adminService.getCompanies(),
      adminService.getCategories(),
    ])
      .then(([jobResponse, companyResponse, categoryResponse]) => {
        if (!mounted) return;
        setJobs(normalizeList<Job>(jobResponse));
        setCompanies(normalizeList<Company>(companyResponse));
        setCategories(normalizeList<JobCategory>(categoryResponse));
        setError('');
      })
      .catch(() => {
        if (mounted) setError('Không tải được danh sách tin tuyển dụng.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  const updateJobInList = (updatedJob: Job) => {
    setJobs((items) => items.map((item) => (item.id === updatedJob.id ? { ...item, ...updatedJob } : item)));
  };

  const closeJob = async (job: Job) => {
    if (!window.confirm(`Đóng tin "${job.title}"?`)) return;

    setSavingId(job.id);
    try {
      const updatedJob = await adminService.closeJob(job.id);
      updateJobInList(updatedJob);
      setError('');
    } catch {
      setError('Đóng tin tuyển dụng thất bại.');
    } finally {
      setSavingId(null);
    }
  };

  const extendJob = async (job: Job) => {
    const defaultDate = job.expiredAt
      ? new Date(job.expiredAt).toISOString().slice(0, 10)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const value = window.prompt('Gia hạn đến ngày (YYYY-MM-DD)', defaultDate);
    if (!value) return;

    setSavingId(job.id);
    try {
      const updatedJob = await adminService.extendJob(job.id, { expiredAt: value });
      updateJobInList(updatedJob);
      setError('');
    } catch {
      setError('Gia hạn tin tuyển dụng thất bại. Kiểm tra định dạng ngày.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteJob = async (job: Job) => {
    if (!window.confirm(`Xóa tin "${job.title}"?`)) return;

    setSavingId(job.id);
    try {
      await adminService.deleteJob(job.id);
      setJobs((items) => items.filter((item) => item.id !== job.id));
      setError('');
    } catch {
      setError('Không thể xóa tin tuyển dụng này.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quản lý tin tuyển dụng</h1>
        <p className="text-sm text-slate-500">Xem tất cả tin, lọc theo trạng thái và đóng/gia hạn tin.</p>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_180px_220px_220px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm theo tiêu đề hoặc mô tả" className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(jobStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select value={companyFilter} onChange={(event) => setCompanyFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="">Tất cả công ty</option>
            {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="">Tất cả ngành nghề</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Tin tuyển dụng</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Công ty</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Ngành</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Trạng thái</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Ứng viên</th>
                <th className="px-5 py-3 text-sm font-bold text-slate-500">Hết hạn</th>
                <th className="px-5 py-3 text-right text-sm font-bold text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Đang tải tin tuyển dụng...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-500">Không có tin tuyển dụng phù hợp.</td></tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{job.title}</div>
                      <div className="mt-1 text-xs text-slate-500">#{job.id} · {job.jobType || '-'}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{job.company?.name || '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{job.category?.name || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${jobStatusClasses[job.status] || 'bg-slate-100 text-slate-700'}`}>
                        {jobStatusLabels[job.status] || job.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{job._count?.applications ?? '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(job.expiredAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => extendJob(job)} disabled={savingId === job.id} className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60">Gia hạn</button>
                        <button onClick={() => closeJob(job)} disabled={savingId === job.id || job.status === 'CLOSED'} className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-60">Đóng</button>
                        <button onClick={() => deleteJob(job)} disabled={savingId === job.id} className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-60">Xóa</button>
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
