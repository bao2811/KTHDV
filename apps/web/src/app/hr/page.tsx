'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/job.service';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/types';
import { JOB_STATUS_LABELS, APPLICATION_STATUS_LABELS } from '@/constants';

export default function HRDashboard() {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState<number>(0);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [activeRes, allRes] = await Promise.all([
          jobService.getJobs({ status: 'ACTIVE', limit: 5 }),
          jobService.getJobs({ limit: 5 }),
        ]);
        setActiveJobs(activeRes.pagination?.total || activeRes.data?.length || 0);
        setTotalJobs(allRes.pagination?.total || allRes.data?.length || 0);
        setRecentJobs(allRes.data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getRoleName = (role: any) => {
    if (typeof role === 'string') return role;
    return role?.name || '';
  };

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Welcome Header */}
      <div className="mb-stack-gap-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">
            Xin chào{user?.fullName ? `, ${user.fullName}` : ''} 👋
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Dưới đây là diễn biến trong quy trình tuyển dụng của bạn hôm nay.
          </p>
        </div>
        <div className="hidden sm:flex gap-3">
          <Link
            href="/hr/jobs/create"
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-bold text-label-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo tin mới
          </Link>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-grid-gutter">
        {/* High Level Metrics */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-grid-gutter">
          {/* Metric Card 1 - Active Jobs */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card relative overflow-hidden group hover:shadow-ambient-card-hover transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-primary">work</span>
            </div>
            <div className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">Công việc đang mở</div>
            {loading ? (
              <div className="h-8 w-16 bg-surface-variant rounded animate-pulse mb-2"></div>
            ) : (
              <div className="font-headline-xl text-headline-xl font-bold text-primary mb-2">{activeJobs}</div>
            )}
            <Link href="/hr/jobs" className="flex items-center gap-1 text-primary font-label-bold text-label-bold hover:underline">
              <span>Xem tất cả</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {/* Metric Card 2 - Total Jobs */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card relative overflow-hidden group hover:shadow-ambient-card-hover transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-secondary">description</span>
            </div>
            <div className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">Tổng tin tuyển dụng</div>
            {loading ? (
              <div className="h-8 w-16 bg-surface-variant rounded animate-pulse mb-2"></div>
            ) : (
              <div className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">{totalJobs}</div>
            )}
            <Link href="/hr/jobs" className="flex items-center gap-1 text-secondary font-label-bold text-label-bold hover:underline">
              <span>Quản lý</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {/* Metric Card 3 - Pipeline */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card relative overflow-hidden group hover:shadow-ambient-card-hover transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-5xl text-tertiary-container">view_kanban</span>
            </div>
            <div className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-2">Pipeline</div>
            <div className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">
              <span className="material-symbols-outlined text-[28px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>view_kanban</span>
            </div>
            <Link href="/hr/pipeline" className="flex items-center gap-1 text-tertiary-container font-label-bold text-label-bold hover:underline">
              <span>Xem quy trình</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface text-[20px]">Thao tác nhanh</h3>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            <Link href="/hr/jobs/create" className="p-4 rounded-lg border border-outline-variant/30 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">add_circle</span>
              </div>
              <div>
                <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">Đăng tin tuyển dụng</div>
                <div className="font-body-sm text-[12px] text-on-surface-variant">Tạo vị trí mới</div>
              </div>
            </Link>

            <Link href="/hr/pipeline" className="p-4 rounded-lg border border-outline-variant/30 hover:bg-secondary/5 hover:border-secondary/30 transition-all cursor-pointer group flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">view_kanban</span>
              </div>
              <div>
                <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-secondary transition-colors">Xem Pipeline</div>
                <div className="font-body-sm text-[12px] text-on-surface-variant">Quản lý quy trình ứng viên</div>
              </div>
            </Link>

            <Link href="/hr/interviews/schedule" className="p-4 rounded-lg border border-outline-variant/30 hover:bg-tertiary/5 hover:border-tertiary/30 transition-all cursor-pointer group flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary-container">calendar_add_on</span>
              </div>
              <div>
                <div className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-tertiary-container transition-colors">Xếp lịch phỏng vấn</div>
                <div className="font-body-sm text-[12px] text-on-surface-variant">Đặt lịch gặp ứng viên</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="col-span-12 bg-surface-container-lowest rounded-xl p-6 shadow-ambient-card mt-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface text-[20px]">Tin tuyển dụng gần đây</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Các vị trí mới nhất trong hệ thống.</p>
            </div>
            <Link href="/hr/jobs" className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-bold text-[11px] hover:bg-surface-variant transition-colors flex items-center gap-1">
              Xem tất cả
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-variant rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-variant rounded w-1/3"></div>
                    <div className="h-3 bg-surface-variant rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-bold text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Vị trí</th>
                    <th className="pb-3 font-semibold">Công ty</th>
                    <th className="pb-3 font-semibold">Trạng thái</th>
                    <th className="pb-3 font-semibold">Ứng viên</th>
                    <th className="pb-3 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50 group transition-colors">
                      <td className="py-4">
                        <Link href={`/hr/jobs/${job.id}`} className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {job.title}
                        </Link>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">{job.location?.city || 'N/A'}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-body-sm text-body-sm text-on-surface">{job.company?.name || 'N/A'}</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full font-label-bold text-[11px] ${
                          job.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          job.status === 'DRAFT' ? 'bg-surface-variant text-on-surface-variant' :
                          job.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {JOB_STATUS_LABELS[job.status] || job.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="font-body-md text-body-md font-semibold text-on-surface">
                          {job._count?.applications || 0}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/hr/jobs/${job.id}`}
                          className="px-3 py-1.5 bg-primary/10 text-primary font-label-bold text-[11px] rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">inbox</span>
              <p className="text-on-surface-variant font-medium">Chưa có tin tuyển dụng nào.</p>
              <Link href="/hr/jobs/create" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Tạo tin đầu tiên
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
