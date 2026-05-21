'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { candidateService } from '@/services/candidate.service';

const FILTER_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'SUBMITTED', label: 'Đã nộp' },
  { id: 'SCREENING', label: 'Sơ vấn' },
  { id: 'MATCHED', label: 'Phù hợp' },
  { id: 'INTERVIEWING', label: 'Phỏng vấn' },
  { id: 'OFFERED', label: 'Lời mời' },
  { id: 'REJECTED', label: 'Từ chối' },
];

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Đã nộp',
  SCREENING: 'Sơ vấn',
  MATCHED: 'Phù hợp',
  INTERVIEWING: 'Phỏng vấn',
  OFFERED: 'Lời mời',
  REJECTED: 'Từ chối',
};

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: 'bg-slate-100 text-slate-700',
  SCREENING: 'bg-emerald-100 text-emerald-700',
  MATCHED: 'bg-indigo-100 text-indigo-700',
  INTERVIEWING: 'bg-blue-100 text-blue-700',
  OFFERED: 'bg-purple-100 text-purple-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const STATUS_PROGRESS: Record<string, number> = {
  SUBMITTED: 10,
  SCREENING: 25,
  MATCHED: 45,
  INTERVIEWING: 70,
  OFFERED: 100,
  REJECTED: 100,
};

export default function CandidateApplications() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await candidateService.getMyApplications({
        status: activeFilter === 'ALL' ? undefined : activeFilter,
        limit: 50,
      });
      setApplications(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách ứng tuyển.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeFilter]);

  const handleCancel = async (applicationId: number) => {
    if (!confirm('Bạn có chắc muốn hủy đơn ứng tuyển này?')) return;
    try {
      await candidateService.cancelApplication(applicationId);
      await fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hủy đơn ứng tuyển.');
    }
  };

  return (
    <div className="p-container-padding max-w-7xl mx-auto w-full space-y-stack-gap-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface">Đơn ứng tuyển</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Theo dõi các vị trí bạn đã ứng tuyển.</p>
        </div>

        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-5 py-2 rounded-xl font-label-bold text-label-bold flex-shrink-0 transition-all duration-300 ${
                activeFilter === tab.id
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-36 bg-surface-container rounded-2xl animate-pulse" />
          ))
        ) : applications.length > 0 ? (
          applications.map((application) => {
            const status = application.status || 'SUBMITTED';
            const progress = STATUS_PROGRESS[status] ?? 0;
            const job = application.job || {};

            return (
              <div
                key={application.id}
                className="group bg-surface-container-lowest rounded-2xl p-6 transition-all duration-300 hover:shadow-ambient-card border border-surface-variant/50 hover:border-primary/30 relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 w-1.5 h-full ${status === 'REJECTED' ? 'bg-red-500' : 'bg-primary'}`} />

                <div className="flex flex-col xl:flex-row justify-between gap-8">
                  <div className="flex items-start gap-5 flex-1">
                    <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 overflow-hidden border border-surface-variant/50 shadow-sm">
                      {job.company?.logoUrl ? (
                        <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="material-symbols-outlined text-primary text-[32px]">domain</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">{job.title || 'Tin tuyển dụng'}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.SUBMITTED}`}>
                          {STATUS_LABELS[status] || status}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant font-medium">
                        {job.company?.name || 'Chưa cập nhật'} • {job.location?.city || 'Linh hoạt'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-outline font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        Ngày ứng tuyển: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </div>
                    </div>
                  </div>

                  <div className="w-full xl:w-1/3 flex flex-col justify-center">
                    <div className="mb-3 flex justify-between items-end">
                      <span className="text-on-surface font-label-bold text-label-bold">Tiến độ</span>
                      <span className="text-primary font-label-bold text-label-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className={`h-full ${status === 'REJECTED' ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/candidate/jobs/${job.id}`} className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant font-label-bold text-label-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all">
                      Xem việc làm
                    </Link>
                    {status === 'SUBMITTED' && (
                      <button
                        onClick={() => handleCancel(application.id)}
                        className="px-6 py-2.5 bg-red-50 text-red-700 font-label-bold text-label-bold rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/50">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[48px] text-outline opacity-40">work_history</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Bạn chưa ứng tuyển vị trí nào</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-center max-w-sm">
              Khám phá các cơ hội việc làm phù hợp với năng lực của bạn.
            </p>
            <Link href="/candidate/jobs" className="mt-8 px-8 py-3 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:shadow-lg transition-all active:scale-95">
              Tìm việc ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
