'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- MOCK DATA ---
const stats = [
  { label: 'Tổng số Người dùng', value: '142,893', trend: '+12.5%', isUp: true, icon: 'group' },
  { label: 'Việc làm đang mở', value: '8,405', trend: '+4.2%', isUp: true, icon: 'work' },
  { label: 'Lượt ứng tuyển', value: '34,291', trend: '-1.8%', isUp: false, icon: 'description' },
  { label: 'Tình trạng hệ thống', value: '99.9%', trend: 'Hoạt động', isUp: true, icon: 'speed', isHealth: true },
];

const auditLogs = [
  { id: 1, user: 'Sarah Jenkins', action: 'thay đổi quyền vai trò cho', target: 'Đội ngũ Marketing', time: '2 phút trước', role: 'Quản trị viên hệ thống', icon: 'security', color: 'bg-black/5 text-black' },
  { id: 2, user: 'Hệ thống tự động', action: 'đã dọn dẹp 420 phiên người dùng không hoạt động', target: '', time: '1 giờ trước', role: 'Hệ thống', icon: 'delete', color: 'bg-black/5 text-black' },
  { id: 3, user: 'Mike Ross', action: 'đã tạo một tích hợp khóa API mới cho', target: 'Đồng bộ Workday', time: '3 giờ trước', role: 'Quản trị viên tích hợp', icon: 'add_circle', color: 'bg-primary/10 text-primary' },
  { id: 4, user: 'Cập nhật hệ thống', action: 'đã áp dụng bản vá v4.2.1 thành công', target: '', time: 'Hôm qua, 23:45', role: 'Hệ thống', icon: 'settings', color: 'bg-black/5 text-black' },
];

const chartData = [
  { month: 'JAN', val1: 40, val2: 60 },
  { month: 'FEB', val1: 55, val2: 50 },
  { month: 'MAR', val1: 45, val2: 70 },
  { month: 'APR', val1: 70, val2: 65 },
  { month: 'MAY', val1: 85, val2: 80 },
  { month: 'JUN', val1: 60, val2: 90 },
];

export default function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState('Monthly');

  return (
    <div className="flex-1 p-container-padding flex flex-col gap-stack-gap-lg max-w-[1440px] mx-auto w-full">
      <div className="flex items-end justify-between mb-2">
        <div>
          <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface tracking-tight">Tổng quan hệ thống</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Số liệu thời gian thực và tình trạng nền tảng.</p>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full font-label-bold text-label-bold text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-black"></span> Dữ liệu trực tiếp
          </span>
        </div>
      </div>

      {/* Metrics Grid (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-gutter">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface rounded-xl shadow-ambient-card p-stack-gap-md flex flex-col justify-between border border-outline-variant/10 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.icon === 'group' ? 'bg-primary/5' : 'bg-black/5'} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                <span className={`material-symbols-outlined ${stat.icon === 'group' ? 'text-primary' : ''}`}>{stat.icon}</span>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${stat.isHealth ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-black/5 text-black'}`}>
                {!stat.isHealth && (
                  <span className="material-symbols-outlined text-[14px] mr-1">
                    {stat.isUp ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                )}
                {stat.trend}
              </span>
            </div>
            <div className="mt-4 relative z-10">
              <h3 className="font-body-sm text-body-sm text-on-surface-variant mb-1">{stat.label}</h3>
              <div className="font-headline-xl text-headline-xl text-on-surface font-bold">{stat.value}</div>
              {stat.isHealth && (
                <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-black h-1.5 rounded-full" style={{ width: stat.value }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Complex Section: Chart & Log */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-grid-gutter mt-2">
        {/* Chart Area */}
        <div className="xl:col-span-8 bg-surface rounded-xl shadow-ambient-card border border-outline-variant/10 p-stack-gap-lg flex flex-col min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Tăng trưởng nền tảng</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Lượng người dùng mới so với Lượng ứng tuyển (Từ đầu năm)</p>
            </div>
            <div className="flex gap-2">
              {['Hàng tháng', 'Hàng năm'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1.5 rounded-md font-label-bold text-label-bold transition-colors border ${
                    chartPeriod === period
                      ? 'text-primary bg-primary/10 border-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container border-outline-variant/20'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {/* Abstract Chart Representation */}
          <div className="flex-1 w-full relative flex items-end pt-8 pb-4">
            {/* Y Axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full border-b border-outline-variant/10 h-0"></div>
              ))}
              <div className="w-full border-b border-on-surface/20 h-0"></div>
            </div>
            {/* Bars */}
            <div className="w-full h-full flex items-end justify-between px-2 relative z-10 gap-2">
              {chartData.map((data, idx) => (
                <div key={idx} className="w-full flex flex-col justify-end items-center group cursor-pointer">
                  <div className={`w-full max-w-[40px] bg-primary/20 rounded-t-md transition-all group-hover:bg-primary/30 relative`} style={{ height: `${data.val1}%` }}>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all group-hover:opacity-90" style={{ height: `${data.val2}%` }}></div>
                  </div>
                  <span className="mt-2 font-label-bold text-label-bold text-on-surface-variant text-[10px]">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="xl:col-span-4 bg-surface rounded-xl shadow-ambient-card border border-outline-variant/10 p-0 flex flex-col min-h-[420px] overflow-hidden">
          <div className="p-stack-gap-lg border-b border-outline-variant/10 flex justify-between items-center bg-surface">
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Nhật ký hệ thống</h3>
            <button className="text-primary hover:text-primary-fixed-dim font-label-bold text-label-bold transition-colors">Xem tất cả</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col">
              {auditLogs.map((log) => (
                <div key={log.id} className="px-stack-gap-lg py-4 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors flex gap-4">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${log.color.split(' ')[0]}`}>
                    <span className={`material-symbols-outlined text-[16px] ${log.color.split(' ')[1]}`}>{log.icon}</span>
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface">
                      <span className="font-semibold">{log.user}</span> {log.action} {log.target && <span className="font-semibold text-primary">{log.target}</span>}
                    </p>
                    <p className="font-label-bold text-label-bold text-outline mt-1 font-normal">{log.time} • {log.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
