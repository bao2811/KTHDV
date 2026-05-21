'use client';

import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/admin.service';
import type { AdminStats, AuditLog, DashboardChartData } from '@/types';

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chartData, setChartData] = useState<DashboardChartData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([
      adminService.getStats(),
      adminService.getDashboardChart(),
      adminService.getAuditLogs({ page: 1, limit: 6 }),
    ])
      .then(([statsData, chart, logs]) => {
        if (!mounted) return;
        setStats(statsData);
        setChartData(chart);
        setAuditLogs(logs.data);
      })
      .catch(() => {
        if (mounted) setError('Không tải được dữ liệu Admin Dashboard.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const maxChartValue = useMemo(() => {
    const values = chartData.flatMap((item) => [item.newUsers, item.applications]);
    return Math.max(1, ...values);
  }, [chartData]);

  const metrics = [
    {
      label: 'Tổng người dùng',
      value: stats ? formatNumber(stats.totalUsers) : '0',
      trend: stats ? `${stats.growth.users >= 0 ? '+' : ''}${stats.growth.users}%` : '0%',
      icon: 'group',
    },
    {
      label: 'Việc làm đang mở',
      value: stats ? formatNumber(stats.totalActiveJobs) : '0',
      trend: stats ? `${stats.growth.jobs >= 0 ? '+' : ''}${stats.growth.jobs}%` : '0%',
      icon: 'work',
    },
    {
      label: 'Ứng tuyển tháng này',
      value: stats ? formatNumber(stats.totalApplicationsThisMonth) : '0',
      trend: stats ? `${stats.growth.applications >= 0 ? '+' : ''}${stats.growth.applications}%` : '0%',
      icon: 'description',
    },
    {
      label: 'Sức khỏe hệ thống',
      value: stats ? `${stats.systemHealth}%` : '0%',
      trend: 'Runtime',
      icon: 'speed',
    },
  ];

  if (loading) {
    return <div className="p-6 text-slate-500">Đang tải dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500">Số liệu thật từ API Admin và audit log.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live data
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <span className="material-symbols-outlined">{metric.icon}</span>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                {metric.trend}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{metric.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tăng trưởng 6 tháng</h2>
              <p className="text-sm text-slate-500">Người dùng mới và lượt ứng tuyển.</p>
            </div>
          </div>
          <div className="flex h-72 items-end gap-3">
            {chartData.map((item) => {
              const userHeight = Math.max(6, (item.newUsers / maxChartValue) * 100);
              const appHeight = Math.max(6, (item.applications / maxChartValue) * 100);

              return (
                <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div className="flex flex-1 items-end justify-center gap-1">
                    <div
                      className="w-5 rounded-t bg-indigo-500"
                      title={`${item.newUsers} người dùng`}
                      style={{ height: `${userHeight}%` }}
                    />
                    <div
                      className="w-5 rounded-t bg-emerald-500"
                      title={`${item.applications} ứng tuyển`}
                      style={{ height: `${appHeight}%` }}
                    />
                  </div>
                  <span className="text-center text-xs font-semibold text-slate-500">{item.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-indigo-500" /> Người dùng</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-emerald-500" /> Ứng tuyển</span>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm xl:col-span-4">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Nhật ký hệ thống</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">Chưa có audit log.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {log.user?.email || 'System'} · {log.action}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {log.resource}
                    {log.resourceId ? ` #${log.resourceId}` : ''} · {formatDateTime(log.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
