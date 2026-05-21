'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { jobService } from '@/services/job.service';
import { Job } from '@/types';
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS } from '@/constants';

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const [data, stats] = await Promise.all([
          jobService.getJobById(id),
          jobService.getJobStatistics(id).catch(() => null),
        ]);
        setJob(data);
        setStatistics(stats);
      } catch (err: any) {
        setError(err.message || 'Không thể tải thông tin công việc');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full animate-pulse">
        <div className="h-4 bg-surface-variant rounded w-48"></div>
        <div className="bg-surface-container-lowest rounded-xl p-8 space-y-4">
          <div className="h-8 bg-surface-variant rounded w-2/3"></div>
          <div className="h-4 bg-surface-variant rounded w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-surface-variant rounded-full w-24"></div>
            <div className="h-6 bg-surface-variant rounded-full w-24"></div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-8 space-y-4">
          <div className="h-6 bg-surface-variant rounded w-1/4"></div>
          <div className="h-4 bg-surface-variant rounded w-full"></div>
          <div className="h-4 bg-surface-variant rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <p className="text-on-surface-variant font-medium">{error || 'Không tìm thấy công việc'}</p>
          <Link href="/hr/jobs" className="mt-4 inline-flex items-center gap-2 text-primary font-label-bold hover:underline">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Quay lại
          </Link>
        </div>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thỏa thuận';
    const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
    if (min && max) return `${fmt(min)} - ${fmt(max)} VNĐ`;
    if (min) return `Từ ${fmt(min)} VNĐ`;
    return `Đến ${fmt(max!)} VNĐ`;
  };

  return (
    <div className="flex-1 flex flex-col gap-stack-gap-lg max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-on-surface-variant mb-2">
        <Link href="/hr/jobs" className="hover:text-primary transition-colors">Tin tuyển dụng</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">{job.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-stack-gap-lg">
        {/* Main Content */}
        <div className="flex-grow lg:w-2/3 space-y-stack-gap-lg">
          {/* Job Header Card */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-gap-lg space-y-stack-gap-md relative">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface">{job.title}</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-stack-gap-sm">
                  {job.company?.name || 'N/A'} • {job.location?.city || 'N/A'}
                </p>
              </div>
              <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center shrink-0 border border-outline-variant">
                {job.company?.logoUrl ? (
                  <img src={job.company.logoUrl} alt={job.company.name} className="w-12 h-12 object-contain rounded-lg" />
                ) : (
                  <span className="material-symbols-outlined text-headline-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-stack-gap-sm mt-stack-gap-md">
              <span className="bg-primary/10 text-primary font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-primary/20">
                {JOB_TYPE_LABELS[job.jobType] || job.jobType || 'N/A'}
              </span>
              <span className={`font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border ${
                job.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' :
                job.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-surface-container text-on-surface-variant border-outline-variant'
              }`}>
                {JOB_STATUS_LABELS[job.status] || job.status}
              </span>
              <span className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
              {job.experienceYears ? (
                <span className="bg-surface-container text-on-surface-variant font-label-bold text-label-bold px-stack-gap-sm py-1 rounded-full border border-outline-variant">
                  {job.experienceYears}+ năm kinh nghiệm
                </span>
              ) : null}
            </div>
          </section>

          {/* Description */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-lg text-headline-lg">Mô tả công việc</h2>
            </div>
            <div className="p-stack-gap-lg font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">
              {job.description || 'Chưa có mô tả.'}
            </div>
          </section>

          {/* Skills */}
          {job.jobSkills && job.jobSkills.length > 0 && (
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low flex items-center gap-stack-gap-sm">
                <span className="material-symbols-outlined text-primary">hub</span>
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Kỹ năng yêu cầu</h3>
              </div>
              <div className="p-stack-gap-md flex flex-wrap gap-stack-gap-sm">
                {job.jobSkills.map((js) => (
                  <span key={js.skillId} className={`px-3 py-1.5 rounded-full font-label-bold text-label-bold border ${
                    js.level === 'REQUIRED' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant'
                  }`}>
                    {js.skill?.name || `Skill #${js.skillId}`}
                    {js.minYears > 0 && <span className="ml-1 opacity-70">({js.minYears}+ năm)</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

          {job.hardFilters && job.hardFilters.length > 0 && (
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low flex items-center gap-stack-gap-sm">
                <span className="material-symbols-outlined text-error">filter_alt</span>
                <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Bo loc cung</h3>
              </div>
              <div className="p-stack-gap-md space-y-2">
                {job.hardFilters.map((filter: any) => (
                  <div key={filter.id} className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-body-sm">
                    <span className="font-semibold text-on-surface">{filter.filterType}</span>
                    <span className="text-on-surface-variant">{filter.operator} {filter.requiredValue}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 flex flex-col gap-stack-gap-lg">
          <div className="bg-primary text-on-primary rounded-xl shadow-lg p-stack-gap-lg flex flex-col items-center text-center">
            <h3 className="font-headline-lg text-headline-lg mb-stack-gap-sm text-on-primary">Quản lý ứng viên</h3>
            <p className="font-body-md text-body-md text-on-primary mb-stack-gap-md opacity-90">
              {job._count?.applications || 0} ứng viên đã ứng tuyển
            </p>
            <Link 
              href={`/hr/jobs/${job.id}/applicants`}
              className="w-full bg-surface text-primary font-label-bold text-label-bold py-stack-gap-md rounded-lg shadow-sm hover:bg-surface-container transition-colors text-center"
            >
              XEM ỨNG VIÊN
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Thông tin nhanh</h3>
            </div>
            <div className="p-stack-gap-md space-y-stack-gap-md">
              {[
                { icon: 'calendar_today', label: 'Ngày tạo', value: new Date(job.createdAt).toLocaleDateString('vi-VN') },
                { icon: 'work', label: 'Loại hình', value: JOB_TYPE_LABELS[job.jobType] || job.jobType || 'N/A' },
                { icon: 'business', label: 'Công ty', value: job.company?.name || 'N/A' },
                { icon: 'location_on', label: 'Địa điểm', value: job.location?.city || 'N/A' },
                { icon: 'category', label: 'Danh mục', value: job.category?.name || 'N/A' },
                { icon: 'payments', label: 'Mức lương', value: formatSalary(job.salaryMin, job.salaryMax) },
              ].map((fact, idx) => (
                <div key={idx} className="flex items-start gap-stack-gap-md">
                  <span className="material-symbols-outlined text-outline">{fact.icon}</span>
                  <div>
                    <div className="font-label-bold text-label-bold text-outline uppercase mb-1">{fact.label}</div>
                    <div className="font-body-sm text-body-sm text-on-surface font-medium">{fact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-stack-gap-md border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-label-bold text-label-bold uppercase text-on-surface">Thong ke ung tuyen</h3>
            </div>
            <div className="p-stack-gap-md space-y-3">
              {Object.entries(statistics?.applicationStats || {}).length > 0 ? (
                Object.entries(statistics.applicationStats).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-body-sm text-on-surface-variant">{status}</span>
                    <span className="font-bold text-on-surface">{String(count)}</span>
                  </div>
                ))
              ) : (
                <p className="text-body-sm text-on-surface-variant">Chua co ung vien.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
